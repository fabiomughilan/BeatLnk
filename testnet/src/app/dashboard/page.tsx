'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Page } from '../../components/PageLayout';
import AuthButton from '../../components/AuthButton';
import Reclaim from '../../components/Reclaim';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <Page>
        <Page.Main className="flex flex-col items-center justify-center">
          <div>Redirecting...</div>
        </Page.Main>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Main className="p-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">📊 Dashboard</h1>
            <p className="text-xl text-gray-600">Welcome! Start your Spotify verification journey.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Reclaim />
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
