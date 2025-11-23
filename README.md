# NFT Collection Minting App - Farcaster Miniapp

A simple, elegant NFT minting application designed for Farcaster miniapps. Built for artists to easily deploy a minting interface for their NFT collections.

## Features

- 🎨 **Simple User Experience**: Clean, intuitive minting interface
- 🔗 **Farcaster Integration**: Works as a Farcaster Frame/Miniapp
- ⚡ **Real-time Status**: Shows minted count and sold-out status
- 🎭 **Auto-reveal**: Automatic NFT reveal after minting completes
- 📱 **Responsive Design**: Works on all devices
- 🌐 **Web3 Integration**: Built with wagmi and viem for robust blockchain interaction

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **Base Network** - L2 blockchain (configurable)

## Setup

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy \`.env.example\` to \`.env.local\` and update the values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required environment variables:

\`\`\`env
# Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...          # Your NFT contract address
NEXT_PUBLIC_CHAIN_ID=8453                   # 8453 for Base, 84532 for Base Sepolia

# Collection Configuration
NEXT_PUBLIC_COLLECTION_NAME=Your Collection Name
NEXT_PUBLIC_COLLECTION_SIZE=100             # Total supply
NEXT_PUBLIC_MINT_PRICE=0.001                # Price in ETH
NEXT_PUBLIC_ARTIST_NAME=Your Name

# RPC Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Metadata Configuration
NEXT_PUBLIC_BASE_URI=ipfs://...             # Your metadata base URI
NEXT_PUBLIC_REVEAL_DELAY_MS=5000            # Delay before reveal (ms)

# Deployment
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
\`\`\`

### 3. Smart Contract Requirements

Your NFT contract should implement these functions:

\`\`\`solidity
function mint() external payable returns (uint256);
function totalSupply() external view returns (uint256);
function maxSupply() external view returns (uint256);
function mintPrice() external view returns (uint256);
function tokenURI(uint256 tokenId) external view returns (string memory);
function balanceOf(address owner) external view returns (uint256);
\`\`\`

If your contract has different function names, update the ABI in \`contracts/NFTCollectionABI.ts\`.

### 4. Add OG Image

Place an Open Graph image at \`public/og-image.png\` (1200x630px recommended) for social sharing and Farcaster Frame preview.

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

\`\`\`bash
vercel --prod
\`\`\`

### After Deployment

1. Update \`NEXT_PUBLIC_BASE_URL\` in your environment variables to your deployed URL
2. Test the Farcaster Frame by sharing your URL in Warpcast
3. The frame should display your OG image with a "Mint NFT" button

## Usage

### For Users

1. Load the miniapp URL in Farcaster or visit directly
2. Connect wallet
3. View collection status (minted count, price)
4. Click "Mint NFT" button
5. Confirm transaction in wallet
6. Wait for automatic reveal
7. View your NFT on OpenSea or mint another

### For Artists

1. Deploy your NFT smart contract
2. Configure this app with your contract details
3. Customize branding (collection name, artist name, colors)
4. Add your OG image
5. Deploy the app
6. Share on Farcaster!

## Customization

### Styling

The app uses Tailwind CSS. Main colors can be customized in:
- \`components/MintingInterface.tsx\`
- \`app/reveal/page.tsx\`

The default gradient is purple-to-blue. Update the \`from-purple-500 to-blue-500\` classes to your preferred colors.

### Contract Integration

If your contract has custom functions, update:
- \`contracts/NFTCollectionABI.ts\` - Add/modify ABI entries
- \`components/MintingInterface.tsx\` - Update contract calls

### Reveal Mechanism

By default, the reveal happens after 5 seconds. Adjust \`NEXT_PUBLIC_REVEAL_DELAY_MS\` in your environment variables.

## Farcaster Frame Metadata

The app includes Farcaster Frame metadata in \`app/layout.tsx\`. This enables it to work as a Frame when shared on Farcaster.

Frame properties:
- Preview image from OG image
- "Mint NFT" button links to the app
- Compatible with Farcaster's Frame specification

## Troubleshooting

### Wallet Won't Connect
- Ensure you're on the correct network (Base/Base Sepolia)
- Check that your RPC URL is correct
- Try refreshing the page

### Mint Transaction Fails
- Verify contract address is correct
- Ensure you have enough ETH for gas + mint price
- Check that collection isn't sold out
- Verify contract functions match the ABI

### Reveal Not Working
- Check that tokenURI is properly set in your contract
- Verify metadata is accessible (IPFS/HTTP)
- Check browser console for errors

### Frame Not Displaying on Farcaster
- Ensure OG image exists at \`public/og-image.png\`
- Verify \`NEXT_PUBLIC_BASE_URL\` is set correctly
- Check that metadata is properly set in \`app/layout.tsx\`

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for artists and collectors
