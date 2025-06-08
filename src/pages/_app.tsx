import { QueryProvider } from '@/providers/QueryProvider';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
  </QueryProvider>
  );
} 