import { chatbotPrompt } from '@/app/helpers/constants/chatbot-prompt'
import { MessageArraySchema } from '@/lib/validators/message'
import { OpenRouterStream, OpenRouterStreamPayload } from '@/lib/openrouter-stream'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const parsedMessages = MessageArraySchema.parse(messages)

  const outboundMessages = parsedMessages.map((message) => ({
    role: message.isUserMessage ? 'user' : 'assistant',
    content: message.text,
  }))

  outboundMessages.unshift({
    role: 'system',
    content: chatbotPrompt,
  })

  const payload: OpenRouterStreamPayload = {
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    messages: outboundMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
  }

  const stream = await OpenRouterStream(payload)
  return new Response(stream)
}