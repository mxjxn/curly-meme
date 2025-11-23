export const config = {
  contractAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
  collectionName: process.env.NEXT_PUBLIC_COLLECTION_NAME || 'NFT Collection',
  collectionSize: parseInt(process.env.NEXT_PUBLIC_COLLECTION_SIZE || '100'),
  mintPrice: process.env.NEXT_PUBLIC_MINT_PRICE || '0.001',
  artistName: process.env.NEXT_PUBLIC_ARTIST_NAME || 'Artist',
  baseRpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  baseUri: process.env.NEXT_PUBLIC_BASE_URI || 'ipfs://placeholder',
  revealDelayMs: parseInt(process.env.NEXT_PUBLIC_REVEAL_DELAY_MS || '5000'),
} as const;
