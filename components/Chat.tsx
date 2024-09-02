'use client'

import { FC } from 'react'
import ChatHeader from '@/components/ChatHeader'
import ChatInput from '@/components/ChatInput'
import ChatMessage from './ChatMessage'
import { useMessages } from '@/context/messages'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'

const Chat: FC = () => {
  const { messages } = useMessages()

  console.log('ChatPage rendered with messages:', messages)

  return (
    <Accordion
      type='single'
      collapsible
      className='fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden shadow'>
      <AccordionItem value='item-1'>
        <div className='w-full h-full flex flex-col'>
          <AccordionTrigger className='px-6 border-b border-zinc-300'>
            <ChatHeader />
          </AccordionTrigger>
          <AccordionContent>
            <div className='flex flex-col h-80'>
              <ChatMessage messages={messages} className="flex-grow overflow-y-auto border-r-2" />
              <ChatInput className="px-4 py-2" />
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default Chat