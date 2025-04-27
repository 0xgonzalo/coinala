'use client';

import { useState } from 'react';
import { createCoin } from '@zoralabs/coins-sdk';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { base } from 'viem/chains';
import { parseEther } from 'viem';
import WalletConnect from './WalletConnect';

interface MintMandalaProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  settings: {
    symmetry: number;
    brushSize: number;
    brushColor: string;
    backgroundColor: string;
  };
}

const MintMandala = ({ canvasRef, settings }: MintMandalaProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleMint = async () => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsMinting(true);
      setError(null);

      // Get the canvas element
      const canvas = canvasRef.current?.querySelector('canvas');
      if (!canvas) {
        throw new Error('Canvas not found');
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create metadata
      const metadata = {
        name: `Mandala #${Date.now()}`,
        description: `A unique mandala with ${settings.symmetry} symmetry`,
        attributes: [
          {
            trait_type: 'Symmetry',
            value: settings.symmetry,
          },
          {
            trait_type: 'Brush Size',
            value: settings.brushSize,
          },
          {
            trait_type: 'Brush Color',
            value: settings.brushColor,
          },
          {
            trait_type: 'Background Color',
            value: settings.backgroundColor,
          },
        ],
      };

      // Create coin parameters
      const coinParams = {
        name: metadata.name,
        symbol: 'MNDL',
        uri: 'ipfs://bafkreihz5knnvvsvmaxlpw3kout23te6yboquyvvs72wzfulgrkwj7r7dm', // Placeholder URI
        payoutRecipient: address,
        platformReferrer: address,
        initialPurchaseWei: parseEther('0.1'),
        currency: '0x0000000000000000000000000000000000000000', // ETH
        tickLower: -199200, // Required for ETH pairs
      };

      // Create the coin
      const result = await createCoin(coinParams, walletClient, publicClient);
      console.log('Coin created:', result.address);

    } catch (err) {
      console.error('Error minting mandala:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint mandala');
    } finally {
      setIsMinting(false);
    }
  };

  if (!isConnected) {
    return <WalletConnect onConnect={() => {}} />;
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm text-gray-600">
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </p>
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMinting ? 'Minting...' : 'Mint as Zora Coin'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default MintMandala; 