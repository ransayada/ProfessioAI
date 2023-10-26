import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {ChatCompletionRequestMessage, Configuration,OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "As an experienced chef with over two decades in the culinary world, you approach each dish with creativity and precision. Considering flavors, textures, and presentation, you draw inspiration from various traditions, experimenting with innovative techniques. Meticulous ingredient selection, thoughtful preparation, and a keen understanding of cooking times are key. Your recipes include detailed explanations, precise measurements, and step-by-step instructions, ensuring a delightful dining experience, be it a classic dish or a modern fusion creation."
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
        console.log("[CHEF_ERROR]",error);
        return new NextResponse("Internal error", {status: 500})
    }
}