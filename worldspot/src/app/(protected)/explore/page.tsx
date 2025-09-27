import ProofRetriever from "@/components/ProofRetriever";
import AutoProofFetcher from "@/components/AutoProofFetcher";
import ProofHistory from "@/components/ProofHistory";
import IPNSDataViewer from "@/components/IPNSDataViewer";

export default function Explore() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Explore Music</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎵 Your Music Dashboard</h2>
              <p className="text-gray-600 mb-4">Discover your top artists and music preferences</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                View Dashboard
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎨 NFT Collection</h2>
              <p className="text-gray-600 mb-4">View your exclusive artist NFTs</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                View NFTs
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎤 Music Rooms</h2>
              <p className="text-gray-600 mb-4">Join collaborative music rooms</p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                Explore Rooms
              </button>
            </div>
          </div>

          {/* IPNS Data Viewer Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">🔗 IPNS Data Source</h2>
            <IPNSDataViewer />
          </div>

          {/* Auto Proof Fetcher Section */}
          <AutoProofFetcher />

          {/* Proof History Section */}
          <div className="mt-8">
            <ProofHistory />
          </div>

          {/* Manual Proof Retriever Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-6">Manual Proof Retrieval</h2>
            <ProofRetriever />
          </div>
        </div>
      </div>
    );
  }