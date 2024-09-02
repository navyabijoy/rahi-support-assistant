'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { FC, ReactNode, useState } from 'react';
import { MessagesProvider } from '@/context/messages';

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <MessagesProvider> 
        {children}
      </MessagesProvider>
    </QueryClientProvider>
  );
};

export default Providers;
