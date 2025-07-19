// app/Providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { MealPlannerProvider } from '@/contexts/MealPlannerContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MealPlannerProvider>{children}</MealPlannerProvider>
    </QueryClientProvider>
  );
}
