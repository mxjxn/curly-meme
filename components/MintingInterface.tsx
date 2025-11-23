'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { NFT_COLLECTION_ABI } from '@/contracts/NFTCollectionABI';
import { config } from '@/lib/config';
import { useRouter } from 'next/navigation';

export function MintingInterface() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);

  // Read contract data
  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    address: config.contractAddress,
    abi: NFT_COLLECTION_ABI,
    functionName: 'totalSupply',
  });

  const { data: maxSupply } = useReadContract({
    address: config.contractAddress,
    abi: NFT_COLLECTION_ABI,
    functionName: 'maxSupply',
  });

  const { data: mintPrice } = useReadContract({
    address: config.contractAddress,
    abi: NFT_COLLECTION_ABI,
    functionName: 'mintPrice',
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const isSoldOut = totalSupply !== undefined && maxSupply !== undefined && totalSupply >= maxSupply;
  const minted = totalSupply !== undefined ? Number(totalSupply) : 0;
  const total = maxSupply !== undefined ? Number(maxSupply) : config.collectionSize;

  useEffect(() => {
    if (isConfirmed && hash) {
      // After successful mint, redirect to reveal page
      refetchSupply();
      const tokenId = totalSupply ? Number(totalSupply) : 0;
      router.push(`/reveal?tokenId=${tokenId}&tx=${hash}`);
    }
  }, [isConfirmed, hash, router, totalSupply, refetchSupply]);

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsMinting(true);
      const priceInEther = mintPrice ? mintPrice : parseEther(config.mintPrice);

      writeContract({
        address: config.contractAddress,
        abi: NFT_COLLECTION_ABI,
        functionName: 'mint',
        value: priceInEther,
      });
    } catch (err) {
      console.error('Minting error:', err);
      setIsMinting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {config.collectionName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              by {config.artistName}
            </p>
          </div>

          {/* Collection Status */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Minted
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {minted} / {total}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(minted / total) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Price
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {config.mintPrice} ETH
              </span>
            </div>
          </div>

          {/* Mint Button */}
          {isSoldOut ? (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                SOLD OUT
              </p>
              <p className="text-sm text-red-500 dark:text-red-300 mt-2">
                All NFTs have been minted
              </p>
            </div>
          ) : (
            <button
              onClick={handleMint}
              disabled={isPending || isConfirming || !isConnected}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                isPending || isConfirming || !isConnected
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {!isConnected ? 'Connect Wallet to Mint' :
               isPending ? 'Confirm in Wallet...' :
               isConfirming ? 'Minting...' :
               'Mint NFT'}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                Error: {error.message}
              </p>
            </div>
          )}

          {/* Wallet Status */}
          {!isConnected && (
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect your wallet to start minting
              </p>
            </div>
          )}

          {isConnected && (
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
