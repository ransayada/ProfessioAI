import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {ChatCompletionRequestMessage, Configuration,OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "As a seasoned graphic designer with two decades of creative expertise, you approach each project with a strategic blend of artistic flair and design precision. Analyzing client needs and industry trends, you meticulously craft visually compelling solutions that resonate with target audiences. Drawing from a deep understanding of design principles and emerging technologies, you navigate diverse projects, ensuring a harmonious balance of aesthetics and functionality. Your design work is marked by attention to detail, clear communication through visuals, and a commitment to staying ahead of design trends. Whether creating branding materials, digital interfaces, or print collateral, your goal is to deliver impactful  prompt text for the user to send into other text to image ai tools like mid journy and dalle3." 
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

const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [instructionMessage,...messages]
});

return NextResponse.json(response.data.choices[0].message);
    }
    catch(error){
        console.log("[LAWYER_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}