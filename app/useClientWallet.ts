import { useMemo } from 'react';
import type { Chain } from 'wagmi';
import { createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { IFrameEthereumConnector } from '@ledgerhq/ledger-live-wagmi-connector';

const BSC_CHAIN: Chain = {
  id: 56,
  name: 'Binance Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://bsc-dataseed1.binance.org',
  },
  blockExplorers: {
    default: {
      name: 'Bscscan',
      url: 'https://bscscan.com',
    },
  },
  multicall: {
    address: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
    blockCreated: 20054518,
  },
};

const AVALANCHE_CHAIN: Chain = {
  id: 43114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: {
      name: 'AvaxScan',
      url: 'https://snowtrace.io/',
    },
  },
  multicall: {
    address: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
    blockCreated: 18068417,
  },
};

const FANTOM_CHAIN: Chain = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
  multicall: {
    address: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
    blockCreated: 43793683,
  },
};

export function useClientWallet() {
  const client = useMemo(() => {
    const { chains, provider, webSocketProvider } = configureChains(
      [chain.mainnet, chain.optimism, chain.polygon, BSC_CHAIN, AVALANCHE_CHAIN, FANTOM_CHAIN],
      [
        jsonRpcProvider({
          priority: 2,
          rpc: (chain) => {
            return { http: `/api/rpc/${chain.id}` };
          },
        }),
        publicProvider({ priority: 1 }),
      ]
    );

    return createClient({
      autoConnect: true,
      connectors: [
        new IFrameEthereumConnector({ chains, options: {} }),
        new InjectedConnector({ chains }),
      ],
      provider,
      webSocketProvider,
    });
  }, []);

  return client;
}
