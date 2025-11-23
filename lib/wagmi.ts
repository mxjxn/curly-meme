'use client';

import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { config as appConfig } from './config';

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(appConfig.baseRpcUrl),
    [baseSepolia.id]: http(),
  },
});
