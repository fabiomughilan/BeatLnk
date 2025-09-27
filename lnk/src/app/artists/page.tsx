'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Page } from '../../components/PageLayout';
import ArtistDashboard from '../../components/ArtistDashboard';
import TopArtists from '../../components/TopArtists';

export default function Artists() {
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🎵 Your Artists</h1>
            <p className="text-xl text-gray-600">Discover your music taste and track your NFT progress</p>
          </div>

          {/* Top Artists Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Artists</h2>
            <TopArtists />
          </div>

          {/* Detailed Artist Dashboard */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Complete Analysis</h2>
            <ArtistDashboard />
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
