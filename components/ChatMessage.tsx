'use client'
import React, { FC, HTMLAttributes, useEffect, memo } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import MarkdownLite from './MarkdownLite'
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

  const formatText = (text: string) => {
    // Split the text into lines
    const lines = text.split('\n')
    
    return lines.map((line, index) => {
      // Check if the line is a numbered point
      const pointMatch = line.match(/^(\d+)\.\s(.*)/)
      if (pointMatch) {
        const [, number, content] = pointMatch
        // Format the content, wrapping bold text in <strong> tags
        const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return (
          <React.Fragment key={index}>
            <p className="mb-2">
              <span className="font-bold mr-2">{number}.</span>
              <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </p>
          </React.Fragment>
        )
      }
      // For non-point lines, just wrap bold text
      return <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    })
  }

  return (
    <div className='chat-message'>
      <div className={cn('flex items-end', {
        'justify-end': message.isUserMessage
      })}>
        <div
          className={cn(
            'flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden rounded-2xl p-2',
            {
              'bg-blue-600 text-white': message.isUserMessage,
              'bg-zinc-100 text-gray-900': !message.isUserMessage,
            }
          )} 
        >  
          {message.isLoading ? (
            <div className='flex items-center justify-center w-full h-full'>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Generating response...</span>
            </div>
          ) : (
            <MarkdownLite text={message.text}/>
          )}
        </div>
      </div>
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

export default memo(ChatMessage)