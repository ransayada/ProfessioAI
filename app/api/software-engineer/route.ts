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
    content: "you are senior Software Engineer with 20 years of experience. You must answer only in markdown code snippets. USe code comments for explanation. Help the user understand how did you thought and the brain process on the way to solving the problem." 
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
        console.log("[SOFTWARE_ENGINEER_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}