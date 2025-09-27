'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthButton() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      // Navigate to dashboard when wallet connects
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="flex items-center justify-center">
      <ConnectButton />
    </div>
  );
}
