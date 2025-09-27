'use client';
import { useState, useEffect } from 'react';

interface ArtistData {
    name: string;
    count: number;
}

interface ArtistAnalysis {
    topArtist: ArtistData | null;
    allArtists: Record<string, number>;
    totalSongs: number;
    nftEligible: boolean;
}

export default function ArtistDashboard() {
    const [artistAnalysis, setArtistAnalysis] = useState<ArtistAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchArtistAnalysis = async () => {
        try {
            setLoading(true);
            // Fetch from IPNS-based endpoint
            const response = await fetch(' https://bok-embowed-season.ngrok-free.dev/api/user-spotify-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch artist analysis from IPNS');
            }

            const result = await response.json();
            
            if (result.success) {
                // Transform IPNS data to match component interface
                const ipnsData = result.data;
                setArtistAnalysis({
                    topArtist: ipnsData.spotifyData.topArtist,
                    allArtists: ipnsData.spotifyData.allArtists,
                    totalSongs: ipnsData.spotifyData.totalSongs,
                    nftEligible: ipnsData.nftStatus.hasEligibleNFTs
                });
            } else {
                setArtistAnalysis(null);
            }
        } catch (error) {
            console.error('Error fetching artist analysis from IPNS:', error);
            setArtistAnalysis(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtistAnalysis();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading your music analysis...</span>
            </div>
        );
    }

    if (!artistAnalysis) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-600">No music data available. Please verify your Spotify account first.</p>
            </div>
        );
    }

    const sortedArtists = Object.entries(artistAnalysis.allArtists)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-2">🎵 Your Music Dashboard</h1>
                <p className="text-purple-100">
                    Discover your top artists and unlock exclusive NFTs based on your music taste!
                </p>
            </div>

      {/* Top 2 Artists Cards */}
      {sortedArtists.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Your Top Artists</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedArtists.slice(0, 2).map(([artist, count], index) => (
              <div key={artist} className={`relative p-6 rounded-xl border-2 ${
                index === 0 
                  ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50'
              }`}>
                {/* Rank Badge */}
                <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                
                {/* Crown for #1 */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2">
                    <span className="text-2xl">👑</span>
                  </div>
                )}
                
                {/* Artist Info */}
                <div className="pt-4">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    index === 0 ? 'text-yellow-800' : 'text-gray-800'
                  }`}>
                    {artist}
                  </h3>
                  
                  <p className="text-gray-600 text-lg mb-4">
                    {count} song{count !== 1 ? 's' : ''} in your library
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress to NFT</span>
                      <span className="text-sm font-medium">{Math.min(count, 10)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* NFT Status */}
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold text-center ${
                    count >= 10 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {count >= 10 ? '🎉 NFT Ready!' : `${10 - count} more songs for NFT`}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show message if only 1 artist */}
          {sortedArtists.length === 1 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-700">
                🎵 Add more artists to your library to see your top 2!
              </p>
            </div>
          )}
        </div>
      )}

            {/* All Artists List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🎶 All Your Artists</h2>
                <div className="space-y-3">
                    {sortedArtists.map(([artist, count]) => (
                        <div key={artist} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-800">{artist}</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">{count} song{count !== 1 ? 's' : ''}</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(count / (artistAnalysis.topArtist?.count || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{artistAnalysis.totalSongs}</div>
                    <div className="text-gray-600">Total Songs</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{sortedArtists.length}</div>
                    <div className="text-gray-600">Unique Artists</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {artistAnalysis.nftEligible ? '1' : '0'}
                    </div>
                    <div className="text-gray-600">NFTs Available</div>
                </div>
            </div>

            {/* NFT Information */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">🎨 NFT Collection</h3>
                <p className="text-yellow-100">
                    When you have 10+ songs from the same artist, you'll automatically receive a custom NFT
                    featuring that artist! Keep listening to unlock exclusive digital collectibles.
                </p>
            </div>
        </div>
    );
}