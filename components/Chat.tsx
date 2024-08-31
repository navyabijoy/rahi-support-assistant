'use client'

import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import ChatHeader from '@/components/ChatHeader'
import ChatInput from '@/components/ChatInput'
import { FC } from 'react'

const Chat: FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='w-80 bg-white border border-gray-200 rounded-md overflow-hidden'>
            <Accordion 
                type='single' 
                collapsible 
                className='relative bg-white z-40 shadow'
                value={isOpen ? 'item-1' : ''}
                onValueChange={(value) => setIsOpen(value === 'item-1')}
            >
                <AccordionItem value='item-1'>
                <div className='fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden'>
          <div className='w-full h-full flex flex-col'>

                    <AccordionTrigger className='px-6 border-b border-zinc-300'>
                        <ChatHeader />
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className='flex flex-col h-80'>
                            
                            <ChatInput className='px-4' />
                        </div>
                    </AccordionContent>
                    </div> </div>
                </AccordionItem>
            </Accordion>
            </div>
    )
}

export default Chat