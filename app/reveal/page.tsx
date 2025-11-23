'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReadContract } from 'wagmi';
import { NFT_COLLECTION_ABI } from '@/contracts/NFTCollectionABI';
import { config } from '@/lib/config';
import Link from 'next/link';

function RevealContent() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');
  const txHash = searchParams.get('tx');

  const [isRevealed, setIsRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: tokenURI, refetch } = useReadContract({
    address: config.contractAddress,
    abi: NFT_COLLECTION_ABI,
    functionName: 'tokenURI',
    args: tokenId ? [BigInt(tokenId)] : undefined,
  });

  const [metadata, setMetadata] = useState<{
    name: string;
    description: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    // Auto-reveal after delay
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, config.revealDelayMs);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch metadata from tokenURI
    if (tokenURI && isRevealed) {
      fetch(tokenURI as string)
        .then(res => res.json())
        .then(data => setMetadata(data))
        .catch(err => {
          console.error('Error fetching metadata:', err);
          // Fallback metadata
          setMetadata({
            name: `${config.collectionName} #${tokenId}`,
            description: `Part of the ${config.collectionName} collection by ${config.artistName}`,
            image: '/placeholder-nft.png',
          });
        });
    }
  }, [tokenURI, isRevealed, tokenId]);

  if (!tokenId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-black p-4">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No token ID provided
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-purple-600 dark:text-purple-400 hover:underline"
          >
            Return to minting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mint Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Token #{tokenId}
            </p>
          </div>

          {/* Reveal Section */}
          <div className="space-y-4">
            {!isRevealed ? (
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-blue-500/50 animate-pulse" />
                <div className="relative text-white text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xl font-bold">Revealing...</p>
                  <p className="text-sm opacity-80">
                    Your NFT is being prepared
                  </p>
                </div>
              </div>
            ) : metadata ? (
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden relative">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={metadata.image}
                    alt={metadata.name}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      // Fallback to placeholder
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzZiN2M4ZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5GVCAje3RleHR9PC90ZXh0Pjwvc3ZnPg=='.replace('{text}', tokenId || '');
                      setImageLoaded(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metadata.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {metadata.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Transaction Info */}
          {txHash && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                Transaction Hash
              </p>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-6 rounded-xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Mint Another
            </Link>
            {metadata && (
              <a
                href={`https://opensea.io/assets/base/${config.contractAddress}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-6 rounded-xl font-bold text-center border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
              >
                View on OpenSea
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RevealPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RevealContent />
    </Suspense>
  );
}
