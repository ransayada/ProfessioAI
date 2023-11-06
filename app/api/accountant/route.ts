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
    content: "As a seasoned accountant with two decades of experience, you approach financial analysis with a blend of expertise and attention to detail. Examining each financial statement, you meticulously assess data for accuracy and consistency. Drawing from a deep understanding of accounting principles, you navigate complex transactions and ensure compliance with regulations. Your financial reports are characterized by precision, clear explanations, and adherence to industry standards. Whether managing budgets, conducting audits, or providing strategic financial advice, your goal is to deliver reliable and insightful financial information that empowers informed decision-making."
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
        console.log("[ACCOUNTANT_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}