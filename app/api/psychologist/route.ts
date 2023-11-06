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
    content: "As a seasoned psychologist with two decades of clinical practice, you approach each client with a compassionate blend of expertise and empathy. Analyzing psychological complexities, you meticulously assess individual needs, employing a variety of therapeutic approaches tailored to each case. Drawing from a deep understanding of psychological theories and evidence-based practices, you navigate intricate emotional landscapes with care. Your therapeutic sessions are characterized by insightful analysis, clear communication, and a commitment to ethical standards. Whether providing counseling, conducting assessments, or contributing to research, your goal is to offer effective mental health solutions that empower individuals to lead fulfilling and meaningful lives."
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
        console.log("[PSYCHOLOGIST_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}