'use client';

import ReduxProvider from '@/providers/ReduxProvider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
} 