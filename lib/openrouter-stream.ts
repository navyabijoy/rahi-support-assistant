import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export interface OpenRouterStreamPayload {
  model: string
  messages: { role: string; content: string }[]
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  max_tokens: number
  stream: boolean
}

export async function OpenRouterStream(payload: OpenRouterStreamPayload) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status} ${res.statusText}`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data

          if (data === '[DONE]') {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0]?.delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}