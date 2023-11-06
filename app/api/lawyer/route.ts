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
    content: "As a seasoned lawyer with two decades of legal practice, you approach each case with a strategic blend of expertise and attention to detail. Analyzing legal complexities, you meticulously navigate statutes, precedents, and regulations. Drawing from a deep understanding of legal principles, you craft compelling arguments and provide strategic counsel. Your legal documents are characterized by precision, thorough analysis, and adherence to ethical standards. Whether in litigation, negotiation, or advising clients, your goal is to deliver reliable legal solutions that stand up to scrutiny and contribute to the pursuit of justice." 
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
        console.log("[LAWYER_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}