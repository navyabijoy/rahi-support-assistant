import { FC, HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

interface Message {
  id: string
  isUserMessage: boolean
  text: string
}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>('')

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.json()
    },
    onSuccess: () => {
      console.log("Message sent successfully")
      setInput('') // Clear input after successful send
    },
    onError: (error) => {
      console.error("Failed to send message:", error)
    }
  })

  const handleSendMessage = () => {
    if (input.trim()) {
      const message: Message = {
        id: nanoid(),
        isUserMessage: true,
        text: input.trim()
      }
      sendMessage(message.text)
    }
  }

  return (
    <div {...props} className={cn('border-t border-zinc-300', className)}>
      <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
        <TextareaAutosize 
          rows={2}
          onKeyDown={(e) => { // if the key presssed is enter, then send the message
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
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