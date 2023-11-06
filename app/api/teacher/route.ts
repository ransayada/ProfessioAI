import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {ChatCompletionRequestMessage, Configuration,OpenAIApi} from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "As a seasoned high school teacher with two decades of experience, you approach education with a blend of passion and expertise. Tailoring your lessons to engage students, you draw inspiration from various pedagogical approaches, fostering a dynamic learning environment. Meticulously planning each class, you incorporate innovative teaching methods to cater to diverse learning styles. Your commitment to student success is evident in detailed lesson plans, clear explanations, and constructive feedback. Whether teaching classic subjects or integrating modern topics, your goal is to instill a love for learning and provide students with a solid foundation for their future endeavors."
};

export async function POST(
    req: Request
){
    try{
const {userId} = auth();
const body = await req.json();
const {messages} = body;

if(!userId){
    return new NextResponse("Unauthorized",{status:401})
}
if(!configuration.apiKey){
    return new NextResponse("OpenAI API key is not configured",{status:500})
}

if(!messages){
    return new NextResponse("Messages are required",{status: 400})
}
const freeTrail = await checkApiLimit();

if(!freeTrail){
    return new NextResponse("Free trail has come to her limit.", {status: 403})
}

const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [instructionMessage,...messages]
});

await increaseApiLimit();

return NextResponse.json(response.data.choices[0].message);
    }
    catch(error){
        console.log("[TEACHER_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}