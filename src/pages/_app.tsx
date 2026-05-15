import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Chatbot } from '@/components/common/Chatbot';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Chatbot />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1B4D3E',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#C19A6B',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}