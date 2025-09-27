'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugPanel() {
  const [debugData, setDebugData] = useState<{
    error?: string;
    debug?: {
      session: {
        walletAddress: string;
        user?: { id: string; username?: string };
      };
      dataSources: {
        inMemory: { available: boolean; data?: { topArtist?: { name: string }; totalSongs: number } };
        ipfsHash: { available: boolean; hash?: string };
        ipns: { available: boolean; count: number; data?: { addedAt: string }[] };
      };
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  const fetchDebugData = async () => {
    try {
      setLoading(true);
      const response = await fetch(' https://97b4ca846410.ngrok-free.app/api/debug-data');
      const result = await response.json();
      setDebugData(result);
    } catch (error) {
      console.error('Debug fetch error:', error);
      setDebugData({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const syncWalletData = async () => {
    try {
      setSyncing(true);
      const response = await fetch(' https://97b4ca846410.ngrok-free.app/api/sync-wallet-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Data synced successfully! Refreshing debug info...');
        await fetchDebugData(); // Refresh debug data
      } else {
        alert('❌ Sync failed: ' + result.error);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('❌ Sync error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 text-white rounded-lg p-4">
        <h3 className="text-lg font-bold mb-2">🔍 Debug Panel</h3>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span>Loading debug info...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">🔍 Debug Panel</h3>
        <div className="flex space-x-2">
          <button 
            onClick={syncWalletData}
            disabled={syncing}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
          <button 
            onClick={fetchDebugData}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {debugData?.error && (
        <div className="bg-red-900 border border-red-700 rounded p-3">
          <p className="text-red-200">Error: {debugData.error}</p>
        </div>
      )}

      {debugData?.debug && (
        <div className="space-y-3">
          {/* Session Info */}
          <div className="bg-gray-700 rounded p-3">
            <h4 className="font-semibold text-yellow-400 mb-2">👤 Session</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-300">Wallet:</span> <code className="bg-gray-600 px-1 rounded">{debugData.debug.session.walletAddress}</code></p>
              <p><span className="text-gray-300">User ID:</span> <code className="bg-gray-600 px-1 rounded">{debugData.debug.session.user?.id || 'N/A'}</code></p>
              <p><span className="text-gray-300">Username:</span> <code className="bg-gray-600 px-1 rounded">{debugData.debug.session.user?.username || 'N/A'}</code></p>
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-gray-700 rounded p-3">
            <h4 className="font-semibold text-yellow-400 mb-2">💾 Data Sources</h4>
            
            {/* In-Memory */}
            <div className="mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${debugData.debug.dataSources.inMemory.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium">In-Memory Store</span>
              </div>
              {debugData.debug.dataSources.inMemory.available && (
                <div className="ml-5 text-xs text-gray-300 mt-1">
                  <p>Top Artist: {debugData.debug.dataSources.inMemory.data?.topArtist?.name || 'None'}</p>
                  <p>Total Songs: {debugData.debug.dataSources.inMemory.data?.totalSongs || 0}</p>
                </div>
              )}
            </div>

            {/* IPFS Hash */}
            <div className="mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${debugData.debug.dataSources.ipfsHash.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium">IPFS Hash</span>
              </div>
              {debugData.debug.dataSources.ipfsHash.available && (
                <div className="ml-5 text-xs text-gray-300 mt-1">
                  <code className="bg-gray-600 px-1 rounded break-all">{debugData.debug.dataSources.ipfsHash.hash}</code>
                </div>
              )}
            </div>

            {/* IPNS */}
            <div className="mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${debugData.debug.dataSources.ipns.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium">IPNS Storage</span>
              </div>
              <div className="ml-5 text-xs text-gray-300 mt-1">
                <p>Proofs Count: {debugData.debug.dataSources.ipns.count}</p>
                {debugData.debug.dataSources.ipns.available && (
                  <p>Latest: {debugData.debug.dataSources.ipns.data && debugData.debug.dataSources.ipns.data.length > 0 ? new Date(debugData.debug.dataSources.ipns.data[debugData.debug.dataSources.ipns.data.length - 1]?.addedAt).toLocaleString() : 'No data'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-900 border border-blue-700 rounded p-3">
            <h4 className="font-semibold text-blue-300 mb-2">💡 Recommendations</h4>
            <div className="text-sm text-blue-200 space-y-2">
              {!debugData.debug.dataSources.inMemory.available && !debugData.debug.dataSources.ipns.available && (
                <div className="space-y-2">
                  <p>• No Spotify data found. You need to verify your account first.</p>
                  <button 
                    onClick={() => router.push('/home')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Go to Home & Verify Spotify
                  </button>
                </div>
              )}
              {debugData.debug.dataSources.inMemory.available && !debugData.debug.dataSources.ipns.available && (
                <div className="space-y-2">
                  <p>• ✅ In-memory data available! Click &quot;Sync Data&quot; to store in IPNS with correct wallet address.</p>
                  <p className="text-xs text-blue-300">Current wallet: {debugData.debug.session.walletAddress}</p>
                </div>
              )}
              {debugData.debug.dataSources.ipns.available && (
                <p>• ✅ IPNS data available! The app should work normally.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
