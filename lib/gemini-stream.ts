import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiStreamPayload {
  messages: GeminiMessage[];
  generationConfig?: GenerationConfig;
}

export async function GeminiStream(payload: GeminiStreamPayload) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: payload.messages,
    generationConfig: payload.generationConfig || {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
  });

  const result = await chat.sendMessageStream(payload.messages[payload.messages.length - 1].parts[0].text);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        controller.enqueue(new TextEncoder().encode(chunkText));
      }
      controller.close();
    },
  });

  return stream;
}