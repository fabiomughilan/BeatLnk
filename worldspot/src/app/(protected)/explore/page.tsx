import TopArtists from "@/components/TopArtists";

export default function Explore() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">VibeCoin Rewards</h1>
          
          {/* VibeCoin Perks Store */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-yellow-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-800 mb-2">🪙 VibeCoin Perks Store</h2>
              <p className="text-yellow-700">Redeem your VibeCoin tokens for exclusive perks and features</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Premium Artist NFT */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-bold text-gray-800">Premium Artist NFT</h3>
                  <p className="text-sm text-gray-600">Custom NFT of your top artist</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">50 VibeCoin</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                    Redeem
                  </button>
                </div>
              </div>

              {/* Music Room Access */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🎤</div>
                  <h3 className="font-bold text-gray-800">Premium Room Access</h3>
                  <p className="text-sm text-gray-600">Join exclusive music rooms</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">25 VibeCoin</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                    Redeem
                  </button>
                </div>
              </div>

              {/* Profile Badge */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-bold text-gray-800">Verified Music Lover</h3>
                  <p className="text-sm text-gray-600">Special profile badge</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">15 VibeCoin</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                    Redeem
                  </button>
                </div>
              </div>

              {/* Playlist Creation */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🎵</div>
                  <h3 className="font-bold text-gray-800">Custom Playlist</h3>
                  <p className="text-sm text-gray-600">AI-generated playlist</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">30 VibeCoin</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                    Redeem
                  </button>
                </div>
              </div>

              {/* Artist Insights */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-bold text-gray-800">Music Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed listening stats</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">20 VibeCoin</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                    Redeem
                  </button>
                </div>
              </div>

              {/* Early Access */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="font-bold text-gray-800">Early Access</h3>
                  <p className="text-sm text-gray-600">Beta features access</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">100 VibeCoin</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                    Redeem
                  </button>
                </div>
              </div>
            </div>

            {/* User's VibeCoin Balance */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
                <span className="text-yellow-600 font-semibold">Your Balance:</span>
                <span className="text-yellow-800 font-bold text-lg">0 VibeCoin</span>
                <button className="text-yellow-600 hover:text-yellow-800 ml-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-yellow-600 mt-2">Earn VibeCoin by verifying your Spotify data!</p>
            </div>
          </div>

          {/* Top Artists Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">🎵 Your Top Artists</h2>
            <TopArtists />
          </div>
        </div>
      </div>
    );
  }