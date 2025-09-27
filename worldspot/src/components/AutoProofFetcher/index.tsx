'use client';
import { useState, useEffect } from 'react';

interface ProofData {
  metadata: {
    retrievedAt: string;
    source: string;
  };
  spotifyData: {
    totalSongs: number;
    topArtists: Record<string, number>;
  };
  analysis: {
    topArtist: {
      name: string;
      count: number;
    } | null;
    nftEligible: boolean;
  };
}

export default function AutoProofFetcher() {
  const [proofData, setProofData] = useState<ProofData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLatestProof = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch from IPNS-based endpoint
      const response = await fetch(' https://97b4ca846410.ngrok-free.app/api/user-spotify-data');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Transform IPNS data to match component interface
          const ipnsData = result.data;
          setProofData({
            metadata: {
              retrievedAt: new Date().toISOString(),
              source: `IPNS - ${ipnsData.totalVerifications} verification(s) - ${ipnsData.dataSource.lastUpdate}`
            },
            spotifyData: {
              totalSongs: ipnsData.spotifyData.totalSongs,
              topArtists: ipnsData.spotifyData.allArtists
            },
            analysis: {
              topArtist: ipnsData.spotifyData.topArtist,
              nftEligible: ipnsData.nftStatus.hasEligibleNFTs
            }
          });
          return;
        }
      }
      
      // If no real data available, show sample data
      setProofData({
        metadata: {
          retrievedAt: new Date().toISOString(),
          source: 'No IPNS data - Verify your Spotify account to see real data'
        },
        spotifyData: {
          totalSongs: 0,
          topArtists: {}
        },
        analysis: {
          topArtist: null,
          nftEligible: false
        }
      });
      
    } catch (_err) {
      // Show sample data on error
      setProofData({
        metadata: {
          retrievedAt: new Date().toISOString(),
          source: 'Error fetching from IPNS - Verify your Spotify account'
        },
        spotifyData: {
          totalSongs: 0,
          topArtists: {}
        },
        analysis: {
          topArtist: null,
          nftEligible: false
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchLatestProof();
  }, []);

  const topArtists = proofData ? Object.entries(proofData.spotifyData.topArtists)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">🎵 Your Latest Spotify Data</h2>
        <p className="text-blue-100">
          Automatically fetched from your most recent verification
        </p>
        <button
          onClick={fetchLatestProof}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Proof Data Display */}
      {proofData && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{proofData.spotifyData.totalSongs}</div>
              <div className="text-gray-600">Total Songs</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{Object.keys(proofData.spotifyData.topArtists).length}</div>
              <div className="text-gray-600">Unique Artists</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {proofData.analysis.nftEligible ? '1' : '0'}
              </div>
              <div className="text-gray-600">NFTs Available</div>
            </div>
          </div>

          {/* No Data Message */}
          {proofData.spotifyData.totalSongs === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-yellow-600 mb-2">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Music Data Yet</h3>
              <p className="text-yellow-700 mb-4">
                Verify your Spotify account to see your music preferences and unlock exclusive NFTs!
              </p>
              <p className="text-sm text-yellow-600">
                Go to the Home page and click &quot;Start Verification&quot; to begin.
              </p>
            </div>
          )}

          {/* Top 2 Artists */}
          {Object.keys(proofData.spotifyData.topArtists).length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🎵 Your Top Artists</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topArtists.slice(0, 2).map(([artist, count], index) => (
                  <div key={artist} className={`relative p-6 rounded-lg border-l-4 ${
                    index === 0 
                      ? 'border-gold bg-gradient-to-r from-yellow-50 to-orange-50' 
                      : 'border-silver bg-gradient-to-r from-gray-50 to-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        count >= 10 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {count >= 10 ? '🎉 NFT Ready!' : `${10 - count} more for NFT`}
                      </div>
                    </div>
                    
                    <h4 className={`text-xl font-bold mb-2 ${
                      index === 0 ? 'text-yellow-800' : 'text-gray-800'
                    }`}>
                      {artist}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">
                        {count} song{count !== 1 ? 's' : ''} in your library
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${(count / (topArtists[0]?.[1] || 1)) * 100}%` }}
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
              
              {/* Show message if less than 2 artists */}
              {topArtists.length === 1 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-blue-700 text-sm">
                    🎵 Listen to more artists to see your top 2!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Top Artists List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🎶 Top Artists</h3>
            <div className="space-y-3">
              {topArtists.map(([artist, count], index) => (
                <div key={artist} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium">{artist}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{count} song{count !== 1 ? 's' : ''}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(count / (topArtists[0]?.[1] || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Last updated: {new Date(proofData.metadata.retrievedAt).toLocaleString()}</span>
              <span>Source: {proofData.metadata.source}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
