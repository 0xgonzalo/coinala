'use client';

import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { http } from 'viem';
import { createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  ssr: false,
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
} 