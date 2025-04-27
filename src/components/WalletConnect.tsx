'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface WalletConnectProps {
  onConnect: (address: `0x${string}`) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const { connect, isPending } = useConnect({
    mutation: {
      onSuccess: (data) => {
        if (data.accounts?.[0]) {
          onConnect(data.accounts[0] as `0x${string}`);
        }
      },
      onError: (err) => {
        console.error('Error connecting wallet:', err);
        setError(err.message);
      },
    },
  });

  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => {
        onConnect('0x0000000000000000000000000000000000000000' as `0x${string}`);
      },
    },
  });

  if (isConnected) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <button
          onClick={() => disconnect()}
          className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default WalletConnect; 