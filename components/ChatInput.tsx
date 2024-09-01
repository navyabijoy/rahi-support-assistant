import { FC, useState } from 'react'
import { cn, sanitizeInput } from '@/lib/utils'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { Message } from '@/lib/validators/message'

interface ChatInputProps {
  className?: string
  onSendMessage: (message: Message) => Promise<void>
  onReceiveMessage?: (message: Message) => void
  isLoading: boolean
}

const ChatInput: FC<ChatInputProps> = ({ className, onSendMessage, onReceiveMessage }) => {
  const [input, setInput] = useState<string>('')
  
  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [message] })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const botMessage: Message = {
            id: nanoid(),
            isUserMessage: false,
            text: chunk
          }
          onReceiveMessage?.(botMessage)
        }
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error)
    }
  })

  const handleSendMessage = () => {
    if (input.trim()) {
      const sanitizedInput = sanitizeInput(input.trim())
      const message: Message = {
        id: nanoid(),
        isUserMessage: true,
        text: sanitizedInput
      }
      onSendMessage(message)
      sendMessage(message)
      setInput('')
    }
  }

  return (
    <div className={cn('border-t border-zinc-300', className)}>
      <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
        <TextareaAutosize 
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          disabled={isLoading} 
          placeholder='Write a message...'
          className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className='absolute bottom-1.5 right-1.5 text-gray-400 hover:text-gray-600'
        >
          Send
        </button>
      </div> 
    </div>
  )
}

export default ChatInput