import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Wallet() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">💰 Vibe Coins Wallet</h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Your Balance</h2>
            <div className="text-4xl font-bold">1,250 Vibe Coins</div>
            <p className="text-yellow-100 mt-2">Earned through music verification and NFT collection</p>
=======
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Background */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 20% 20%, rgba(14,165,233,.15), transparent), radial-gradient(60rem 60rem at 80% 70%, rgba(99,102,241,.15), transparent)",
          backgroundSize: "200% 200%",
          animation: "bgShift 18s ease-in-out infinite alternate",
        }}
      />
      <style jsx global>{`
        @keyframes bgShift {
          from { background-position: 0% 0%; }
          to   { background-position: 100% 100%; }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">💰 VibeCoin Wallet</h1>

        {/* Balance */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-6 text-center">
          <p className="text-sm opacity-70">Your Balance</p>
          <div className="text-5xl font-extrabold text-amber-300 mt-2">{balance}</div>
          <p className="text-sm mt-1 opacity-70">VibeCoins</p>

          <div className="flex justify-center gap-3 mt-5">
            <button className="rounded-full bg-emerald-400/20 text-emerald-300 px-5 py-2 text-sm font-medium hover:bg-emerald-400/30 transition">
              Earn More
            </button>
            <button className="rounded-full bg-amber-400/20 text-amber-300 px-5 py-2 text-sm font-medium hover:bg-amber-400/30 transition">
              Redeem
            </button>
>>>>>>> parent of 68c4cd4 (vercel1)
          </div>


          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🏆 Top Vibe Coin Holders</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <p className="font-bold text-gray-800">MusicMaven</p>
                    <p className="text-sm text-gray-600">@musicmaven.wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">5,420</p>
                  <p className="text-xs text-gray-500">Vibe Coins</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-l-4 border-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <p className="font-bold text-gray-800">BeatCollector</p>
                    <p className="text-sm text-gray-600">@beatcollector.wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-600">4,180</p>
                  <p className="text-xs text-gray-500">Vibe Coins</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <p className="font-bold text-gray-800">VinylVibes</p>
                    <p className="text-sm text-gray-600">@vinylvibes.wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">3,750</p>
                  <p className="text-xs text-gray-500">Vibe Coins</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <p className="font-bold text-gray-800">MelodyMaster</p>
                    <p className="text-sm text-gray-600">@melodymaster.wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">2,950</p>
                  <p className="text-xs text-gray-500">Vibe Coins</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
                  <div>
                    <p className="font-bold text-gray-800">RhythmRider</p>
                    <p className="text-sm text-gray-600">@rhythmrider.wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">2,680</p>
                  <p className="text-xs text-gray-500">Vibe Coins</p>
                </div>
              </div>
              
              {/* Current User Position */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">12</div>
                  <div>
                    <p className="font-bold text-blue-800">You</p>
                    <p className="text-sm text-blue-600">{session.user?.username || 'Your Wallet'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">1,250</p>
                  <p className="text-xs text-blue-500">Vibe Coins</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>Tip:</strong> Verify more music data and collect NFTs to climb the leaderboard!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
