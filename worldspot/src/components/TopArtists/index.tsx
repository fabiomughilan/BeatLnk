'use client';
import { useState, useEffect } from 'react';

interface SpotifyData {
  totalSongs: number;
  totalArtists: number;
  top2Artists: Array<{ name: string; count: number }>;
  topArtist: { name: string; count: number } | null;
}

interface UserSpotifyData {
  walletAddress: string;
  spotifyData: SpotifyData;
}

export default function TopArtists() {
  const [userData, setUserData] = useState<UserSpotifyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTopArtists = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/user-spotify-data');
      const result = await response.json();
      
      if (result.success) {
        setUserData(result.data);
      } else {
        setError(result.error || 'Failed to fetch top artists');
      }
    } catch (err) {
      setError('Error loading your music data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopArtists();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading your top artists...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🎵</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">No Music Data Found</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-gray-600 mb-4">Verify your Spotify account on the home page to see your top artists here!</p>
          <button 
            onClick={fetchTopArtists}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData || !userData.spotifyData.top2Artists.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎧</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Discover Your Music Taste?</h3>
          <p className="text-gray-600 mb-4">Connect your Spotify account to see your top artists and unlock music-based rewards!</p>
          <div className="text-sm text-gray-500">
            Go to Home → Start Verification
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Music Stats Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-800 mb-2">🎵 Your Music Profile</h3>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-purple-700">{userData.spotifyData.totalSongs}</div>
              <div className="text-purple-600">Liked Songs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-purple-700">{userData.spotifyData.totalArtists}</div>
              <div className="text-purple-600">Artists</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.spotifyData.top2Artists.map((artist, index) => (
          <div 
            key={artist.name} 
            className={`relative p-6 rounded-xl shadow-lg border-2 ${
              index === 0
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50'
                : 'border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50'
            }`}
          >
            {/* Rank Badge */}
            <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
              index === 0 ? 'bg-yellow-500' : 'bg-purple-500'
            }`}>
              {index + 1}
            </div>

            {/* Artist Info */}
            <div className="text-center">
              <div className="text-4xl mb-3">
                {index === 0 ? '👑' : '🎤'}
              </div>
              <h4 className={`text-xl font-bold mb-2 ${
                index === 0 ? 'text-yellow-800' : 'text-purple-800'
              }`}>
                {artist.name}
              </h4>
              <div className={`text-lg font-semibold mb-3 ${
                index === 0 ? 'text-yellow-700' : 'text-purple-700'
              }`}>
                {artist.count} liked songs
              </div>

              {/* NFT Status */}
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${
                artist.count >= 10
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}>
                {artist.count >= 10 ? (
                  <>
                    <span className="mr-1">🎉</span>
                    NFT Eligible!
                  </>
                ) : (
                  <>
                    <span className="mr-1">⏳</span>
                    {10 - artist.count} more for NFT
                  </>
                )}
              </div>
            </div>

            {/* Special Crown for #1 */}
            {index === 0 && (
              <div className="absolute -top-2 -right-2 text-2xl">
                ✨
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 text-center">
        <div className="text-3xl mb-2">🎯</div>
        <h4 className="text-lg font-bold text-blue-800 mb-2">Want to Update Your Top Artists?</h4>
        <p className="text-blue-700 text-sm mb-3">
          Verify your Spotify data again to refresh your music profile and discover new artists!
        </p>
        <div className="text-xs text-blue-600">
          Changes in your liked songs will update your artist rankings
        </div>
      </div>
    </div>
  );
}

