'use client';
import { useState, useEffect } from 'react';

interface ProofHistory {
  proofId: string;
  addedAt: string;
  totalSongs: number;
  timestamp: number;
}

interface UserProofsData {
  userId: string;
  totalProofs: number;
  latestProof: any;
  latestAnalysis: any;
  allProofs: ProofHistory[];
}

export default function ProofHistory() {
  const [proofsData, setProofsData] = useState<UserProofsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProofHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://82f141aa390b.ngrok-free.app/api/user-proofs');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProofsData(result.data);
          return;
        }
      }
      
      // If no data available, show empty state
      setProofsData({
        userId: 'unknown',
        totalProofs: 0,
        latestProof: null,
        latestAnalysis: null,
        allProofs: []
      });
      
    } catch (err) {
      // Show empty state on error
      setProofsData({
        userId: 'unknown',
        totalProofs: 0,
        latestProof: null,
        latestAnalysis: null,
        allProofs: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProofHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading proof history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!proofsData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading proof history...</p>
      </div>
    );
  }

  if (proofsData.totalProofs === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-yellow-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Verification History</h3>
          <p className="text-yellow-700 mb-4">
            You haven't verified your Spotify account yet. Start your verification journey to see your music data here!
          </p>
          <p className="text-sm text-yellow-600">
            Go to the Home page and click "Start Verification" to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">📚 Your Verification History</h2>
        <p className="text-purple-100">
          Track your Spotify verification journey over time
        </p>
        <div className="mt-4 flex items-center space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{proofsData.totalProofs}</div>
            <div className="text-sm text-purple-200">Total Verifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{proofsData.latestAnalysis?.totalSongs || 0}</div>
            <div className="text-sm text-purple-200">Latest Songs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{Object.keys(proofsData.latestAnalysis?.allArtists || {}).length}</div>
            <div className="text-sm text-purple-200">Latest Artists</div>
          </div>
        </div>
      </div>

      {/* Latest Analysis */}
      {proofsData.latestAnalysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">🎵 Latest Music Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{proofsData.latestAnalysis.totalSongs}</div>
              <div className="text-sm text-gray-600">Total Songs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Object.keys(proofsData.latestAnalysis.allArtists).length}</div>
              <div className="text-sm text-gray-600">Unique Artists</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {proofsData.latestAnalysis.nftEligible ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600">NFTs Available</div>
            </div>
          </div>
          
          {proofsData.latestAnalysis.topArtist && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🏆 Top Artist</h4>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">{proofsData.latestAnalysis.topArtist.name}</span>
                <span className="text-sm text-gray-600">{proofsData.latestAnalysis.topArtist.count} songs</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proof History Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">📅 Verification Timeline</h3>
        <div className="space-y-4">
          {proofsData.allProofs.map((proof, index) => (
            <div key={proof.proofId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">
                    Verification #{index + 1}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(proof.addedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">
                    🎵 {proof.totalSongs} songs
                  </span>
                  <span className="text-sm text-gray-600">
                    🕒 {new Date(proof.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Proof ID</div>
                <div className="text-xs font-mono text-gray-700">
                  {proof.proofId.substring(0, 12)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchProofHistory}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
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
              <span>Refresh History</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
