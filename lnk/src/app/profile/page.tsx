'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Page } from '../../components/PageLayout';

export default function Profile() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    totalVerifications: 0,
    totalSongs: 0,
    totalArtists: 0,
    nftsEligible: 0,
    joinDate: new Date().toLocaleDateString(),
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (isConnected && address) {
      // Fetch user profile data
      fetchProfileData();
    }
  }, [isConnected, address]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/user-spotify-data?wallet=${address}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProfileData({
            totalVerifications: result.data.totalVerifications || 1,
            totalSongs: result.data.spotifyData.totalSongs || 0,
            totalArtists: result.data.spotifyData.totalArtists || 0,
            nftsEligible: result.data.nftStatus.eligibleArtists?.length || 0,
            joinDate: new Date(result.data.latestVerification || Date.now()).toLocaleDateString(),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

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
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">👤 Your Profile</h1>
            <p className="text-xl text-gray-600">Manage your music verification profile</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎵</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Music Enthusiast</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-mono text-sm">
                    {address?.slice(0, 8)}...{address?.slice(-6)}
                  </span>
                </div>
                <p className="text-purple-100 text-sm mt-1">Member since {profileData.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{profileData.totalVerifications}</div>
              <div className="text-gray-600">Verifications</div>
              <div className="text-sm text-gray-500 mt-1">Spotify connections</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{profileData.totalSongs}</div>
              <div className="text-gray-600">Liked Songs</div>
              <div className="text-sm text-gray-500 mt-1">In your library</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{profileData.totalArtists}</div>
              <div className="text-gray-600">Artists</div>
              <div className="text-sm text-gray-500 mt-1">Unique artists</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{profileData.nftsEligible}</div>
              <div className="text-gray-600">NFTs Eligible</div>
              <div className="text-sm text-gray-500 mt-1">Ready to mint</div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🛠 Profile Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">🔄</span>
                <div>
                  <div className="font-semibold text-gray-800">Verify Spotify Again</div>
                  <div className="text-sm text-gray-600">Update your music data</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/history')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <div className="font-semibold text-gray-800">View History</div>
                  <div className="text-sm text-gray-600">See all verifications</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/artists')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">🎵</span>
                <div>
                  <div className="font-semibold text-gray-800">Explore Artists</div>
                  <div className="text-sm text-gray-600">View your top artists</div>
                </div>
              </button>
              
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="font-semibold text-gray-600">NFT Collection</div>
                  <div className="text-sm text-gray-500">Coming soon...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🔐 Wallet Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Wallet Address</span>
                <code className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded">
                  {address}
                </code>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">Connection Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-semibold">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
