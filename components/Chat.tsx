'use client'

import { useState, useEffect } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import ChatHeader from '@/components/ChatHeader'
import ChatInput from '@/components/ChatInput'
import { FC } from 'react'
import ChatMessage from './ChatMessage'
import { rahiData, ChatResponse } from '../app/helpers/constants/rahi-data'
import { nanoid } from 'nanoid'

interface Message {
  id: string
  isUserMessage: boolean
  text: string
}

function findBestMatch(question: string, data: ChatResponse[]): ChatResponse | null {
  const lowercaseQuestion = question.toLowerCase();
  let bestMatch: ChatResponse | null = null;
  let highestScore = 0;

  for (const item of data) {
    const score = calculateSimilarity(lowercaseQuestion, item.question.toLowerCase());
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return highestScore > 0.6 ? bestMatch : null;
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

function getChatbotResponse(userInput: string): string {
  const match = findBestMatch(userInput, rahiData);

  if (match) {
    let response = match.answer;

    if (match.options) {
      response += "\n\nRelated questions you might be interested in:";
      match.options.forEach(option => {
        response += `\n- ${option}`;
      });
    }


    return response;
  } else {
    return "I'm sorry, I don't have specific information about that. Is there anything else I can help you with regarding the Rahi?";
  }
}

const Chat: FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        // Add welcome message when the component mounts
        const welcomeMessage: Message = {
            id: nanoid(),
            isUserMessage: false,
            text: "Welcome to Rahi! Do you have any questions about our AI-powered travel app? I'm here to help!"
        }
        setMessages([welcomeMessage])
    }, [])

    const handleSendMessage = (message: Message) => {
        setMessages(prev => [...prev, message])
        
        // Generate chatbot response
        const botResponse = getChatbotResponse(message.text)
        const botMessage: Message = {
            id: nanoid(),
            isUserMessage: false,
            text: botResponse
        }
        
        // Add bot message to chat
        setMessages(prev => [...prev, botMessage])
    }

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
                                    <ChatMessage 
                                        messages={messages}
                                        className='px-2 py-3 flex-1'
                                    />
                                    <ChatInput 
                                        className='px-4'
                                        onSendMessage={handleSendMessage}
                                    />
                                </div>
                            </AccordionContent>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Chat