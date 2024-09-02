'use client'

import { FC, HTMLAttributes, useEffect, memo } from 'react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  isLoading: boolean
  isUserMessage: boolean
  text: string
}

interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  messages: Message[]
}

const ChatMessage: FC<ChatMessageProps> = ({ className, messages = [], ...props }) => {
  useEffect(() => {
    console.log('ChatMessage rendered with messages:', messages)
  }, [messages])

  const inverseMessages = [...messages].reverse()

  return (
    <div
      {...props}
      className={cn(
        'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch',
        className
      )}
    >
      <div className='flex-1 flex-grow' />
      {inverseMessages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}

const MessageItem = memo<{ message: Message }>(({ message }) => {
  console.log('Rendering message:', message)
  return (
    <div className='chat-message'>
      <div className={cn('flex items-end', {
        'justify-end': message.isUserMessage
      })}>
        <div
          className={cn(
            'flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden rounded-lg p-3',
            {
              'bg-blue-600 text-white': message.isUserMessage,
              'bg-gray-200 text-gray-900': !message.isUserMessage,
            }
          )}
        >
          {message.isLoading ? (
            <span>Loading...</span>
          ) : (
            <span>{message.text}</span>
          )}
        </div>
      </div>
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

export default memo(ChatMessage)