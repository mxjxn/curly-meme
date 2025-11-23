import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { config } from "@/lib/config";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-app.vercel.app';

export const metadata: Metadata = {
  title: `${config.collectionName} - NFT Minting`,
  description: `Mint exclusive NFTs from ${config.collectionName} by ${config.artistName}`,
  openGraph: {
    title: `${config.collectionName} - NFT Minting`,
    description: `Mint exclusive NFTs from ${config.collectionName} by ${config.artistName}`,
    images: [`${baseUrl}/og-image.png`],
  },
  other: {
    // Farcaster Frame metadata
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/og-image.png`,
    'fc:frame:button:1': 'Mint NFT',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
