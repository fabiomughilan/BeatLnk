'use client';
import { useState, useEffect } from 'react';

interface IPNSSpotifyData {
  walletAddress: string;
  totalVerifications: number;
  latestVerification: string;
  spotifyData: {
    totalSongs: number;
    totalArtists: number;
    allArtists: Record<string, number>;
    top2Artists: Array<{ name: string; count: number }>;
    topArtist: { name: string; count: number } | null;
  };
  nftStatus: {
    eligibleArtists: Array<[string, number]>;
    hasEligibleNFTs: boolean;
  };
  dataSource: {
    source: string;
    ipnsAccess: string;
    lastUpdate: string;
  };
}

export default function IPNSDataViewer() {
  const [ipnsData, setIpnsData] = useState<IPNSSpotifyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFromIPNS = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/user-spotify-data');
      const result = await response.json();
      
      if (result.success) {
        setIpnsData(result.data);
      } else {
        setError(result.error || 'Failed to fetch from IPNS');
      }
    } catch (err) {
      setError('Error connecting to IPNS: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromIPNS();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Fetching from IPNS...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">IPNS Fetch Error</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchFromIPNS}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!ipnsData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No IPNS Data</h3>
          <p className="text-yellow-700 mb-4">No Spotify verification data found in IPNS storage.</p>
          <p className="text-sm text-yellow-600">Verify your Spotify account to create IPNS records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* IPNS Data Source Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">✅ Data Source: IPNS</h2>
            <p className="text-green-600 text-sm">Fetched directly from decentralized IPNS storage</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-semibold">Wallet:</span> <code className="bg-white px-2 py-1 rounded">{ipnsData.walletAddress}</code></p>
            <p><span className="font-semibold">Total Verifications:</span> {ipnsData.totalVerifications}</p>
          </div>
          <div>
            <p><span className="font-semibold">Last Update:</span> {new Date(ipnsData.latestVerification).toLocaleString()}</p>
            <p><span className="font-semibold">Storage:</span> {ipnsData.dataSource.source}</p>
          </div>
        </div>
      </div>

      {/* Top 2 Artists from IPNS */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎵 Top 2 Artists (From IPNS)</h3>
        
        {ipnsData.spotifyData.top2Artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ipnsData.spotifyData.top2Artists.map((artist, index) => (
              <div key={artist.name} className={`relative p-6 rounded-lg border-l-4 ${
                index === 0
                  ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50'
                  : 'border-gray-400 bg-gradient-to-r from-gray-50 to-blue-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    artist.count >= 10
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {artist.count >= 10 ? '🎉 NFT Ready!' : `${10 - artist.count} more for NFT`}
                  </div>
                </div>

                <h4 className={`text-xl font-bold mb-2 ${
                  index === 0 ? 'text-yellow-800' : 'text-gray-800'
                }`}>
                  {artist.name}
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    {artist.count} song{artist.count !== 1 ? 's' : ''} in your library
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${(artist.count / (ipnsData.spotifyData.top2Artists[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Crown for #1 artist */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">👑</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No artists found in IPNS data</p>
          </div>
        )}
      </div>

      {/* IPNS Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 IPNS Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{ipnsData.spotifyData.totalSongs}</div>
            <div className="text-sm text-gray-600">Total Songs</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{ipnsData.spotifyData.totalArtists}</div>
            <div className="text-sm text-gray-600">Unique Artists</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{ipnsData.nftStatus.eligibleArtists.length}</div>
            <div className="text-sm text-gray-600">NFT Eligible</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{ipnsData.totalVerifications}</div>
            <div className="text-sm text-gray-600">Verifications</div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchFromIPNS}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh from IPNS</span>
        </button>
      </div>
    </div>
  );
}
