import './globals.css'
import { Inter } from 'next/font/google'
import { MessagesProvider } from '@/context/messages'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'OpenRouter Chat App',
  description: 'A chat application powered by OpenRouter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <MessagesProvider>
            {children}
          </MessagesProvider>
        </Providers>
      </body>
    </html>
  )
}