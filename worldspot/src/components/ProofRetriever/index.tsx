'use client';
import { useState } from 'react';

interface SpotifyData {
  likedSongs: any[];
  totalSongs: number;
}

interface UserInfo {
  username: string;
  email: string;
}

interface Verification {
  provider: string;
  timestamp: string;
  signature: string;
}

interface ProofData {
  metadata: {
    ipfsHash: string;
    retrievedAt: string;
    dataSize: number;
  };
  spotifyData: SpotifyData;
  userInfo: UserInfo;
  verification: Verification;
  rawData: any;
}

export default function ProofRetriever() {
  const [ipfsHash, setIpfsHash] = useState('');
  const [proofData, setProofData] = useState<ProofData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const retrieveProof = async () => {
    if (!ipfsHash.trim()) {
      setError('Please enter an IPFS hash');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(` https://bok-embowed-season.ngrok-free.dev/api/retrieve-proof?hash=${encodeURIComponent(ipfsHash)}`);
      const result = await response.json();

      if (result.success) {
        setProofData(result.data);
      } else {
        setError(result.error || 'Failed to retrieve proof data');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const analyzeArtists = (likedSongs: any[]) => {
    const artistCount: Record<string, number> = {};
    
    likedSongs.forEach(song => {
      song.track?.artists?.forEach((artist: any) => {
        if (artist.name) {
          artistCount[artist.name] = (artistCount[artist.name] || 0) + 1;
        }
      });
    });

    return Object.entries(artistCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10 artists
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🔍 Retrieve Spotify Proof Data</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IPFS Hash
            </label>
            <input
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              placeholder="Enter IPFS hash (e.g., QmTsC1UxihvZYBcrA36DGpikiyR8ShosCcygKojHVdjpGd)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={retrieveProof}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Retrieving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Retrieve Data</span>
              </>
            )}
          </button>
        </div>
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
          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">IPFS Hash</p>
                <p className="font-mono text-sm break-all">{proofData.metadata.ipfsHash}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Retrieved At</p>
                <p className="text-sm">{new Date(proofData.metadata.retrievedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Size</p>
                <p className="text-sm">{proofData.metadata.dataSize} bytes</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">👤 User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium">{proofData.userInfo.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{proofData.userInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Spotify Data */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🎵 Spotify Data</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Liked Songs</p>
              <p className="text-2xl font-bold text-blue-600">{proofData.spotifyData.totalSongs}</p>
            </div>
            
            {/* Top Artists */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Top Artists</h4>
              <div className="space-y-2">
                {analyzeArtists(proofData.spotifyData.likedSongs).map(([artist, count], index) => (
                  <div key={artist} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{artist}</span>
                    </div>
                    <span className="text-sm text-gray-600">{count} songs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🔐 Verification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium">{proofData.verification.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p className="font-medium">{new Date(parseInt(proofData.verification.timestamp)).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Signature</p>
                <p className="font-mono text-sm">{proofData.verification.signature}</p>
              </div>
            </div>
          </div>

          {/* Sample Songs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🎶 Sample Liked Songs</h3>
            <div className="space-y-3">
              {proofData.spotifyData.likedSongs.slice(0, 5).map((song, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{song.track?.name || 'Unknown Song'}</p>
                    <p className="text-sm text-gray-600">
                      {song.track?.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {song.track?.duration_ms ? `${Math.floor(song.track.duration_ms / 60000)}:${String(Math.floor((song.track.duration_ms % 60000) / 1000)).padStart(2, '0')}` : '--:--'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
