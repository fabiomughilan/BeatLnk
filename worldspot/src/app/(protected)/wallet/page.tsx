import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Wallet() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  // TODO: Replace with real on-chain fetch for balance + tx history
  const balance = 1250;
  const transactions = [
    { id: 1, type: "Earned", amount: 250, date: "2025-09-15", desc: "Spotify verification" },
    { id: 2, type: "Redeemed", amount: -50, date: "2025-09-20", desc: "Poster perk" },
    { id: 3, type: "Earned", amount: 500, date: "2025-09-22", desc: "Artist like rewards" },
  ];

  return (
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
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div>
                  <div className="text-sm font-medium">{tx.desc}</div>
                  <div className="text-xs opacity-70">{tx.date}</div>
                </div>
                <div
                  className={`font-semibold ${
                    tx.amount > 0 ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} VC
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helper text */}
        <p className="text-[11px] opacity-60 text-center mt-6">
          VibeCoin balance and history are synced from World mainnet. Claims and redemptions are anchored on-chain and stored to Filecoin.
        </p>
      </div>
    </div>
  );
}