import { GoogleGenerativeAI } from '@google/generative-ai';
// import { chatbotPrompt } from "@/app/helpers/constants/chatbot-prompt";
import { MessageArraySchema } from "@/lib/validators/message";
import { GeminiStream, GeminiStreamPayload } from '@/lib/gemini-stream'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const payload: GeminiStreamPayload = {
    messages: messages.map((message: any) => ({
      role: message.isUserMessage ? 'user' : 'model',
      parts: [{ text: message.text }],
    })),
  }

  const stream = await GeminiStream(payload)
  return new Response(stream)

    // try {
    //     // Initialize a chat
    //     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    //     const chat = model.startChat({
    //         history: geminiMessages,
    //         generationConfig: {
    //             temperature: 0.5,
    //             topK: 1,
    //             topP: 1,
    //             maxOutputTokens: 150,
    //         },
    //     });

    //     // Generate a response
    //     const result = await chat.sendMessage(geminiMessages[geminiMessages.length - 1].parts[0].text);
    //     const response = result.response;

    //     // Return the response
    //     return new Response(JSON.stringify({ 
    //         response: response.text(),
    //         // Add any other fields you need from the response
    //     }), {
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // } catch (error) {
    //     console.error('Error:', error);
    //     return new Response(JSON.stringify({ error: 'An error occurred while processing your request.' }), {
    //         status: 500,
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // }
}