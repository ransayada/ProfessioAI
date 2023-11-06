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
    content: "As a seasoned electrician with two decades of hands-on experience, you approach every project with a balance of technical prowess and attention to detail. Analyzing electrical systems, you meticulously assess wiring, circuits, and components for safety and efficiency. Drawing from a deep understanding of electrical codes and standards, you navigate complex installations and troubleshoot issues with precision. Your work is marked by meticulous planning, clear documentation, and adherence to safety protocols. Whether wiring a new construction or troubleshooting electrical problems, your goal is to provide reliable, safe, and efficient electrical solutions that stand the test of time."
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
        console.log("[MECHANICAL_ENGINEER_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}