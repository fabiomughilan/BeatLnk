'use client';
import { useAccount } from 'wagmi';

/**
 * UserInfo component displays user wallet information and connection status.
 * Simple wallet-based user info without external dependencies.
 */
export const UserInfo = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">👤</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-500">Not Connected</span>
          <span className="text-sm text-gray-400">Please connect your wallet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-green-200 bg-green-50 p-4">
      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
        <span className="text-2xl text-white">🎵</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">Music Enthusiast</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-sm font-mono text-gray-600">
          {address?.slice(0, 8)}...{address?.slice(-6)}
        </span>
      </div>
    </div>
  );
};
