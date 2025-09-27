"use client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

function truncate(addr?: string, left = 6, right = 4) {
  if (!addr) return "Not connected";
  if (addr.length <= left + right) return addr;
  return `${addr.slice(0, left)}…${addr.slice(-right)}`;
}

export default async function Profile() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const name = session.user?.name || "User";
  const email = session.user?.email || "user@example.com";
  const wallet = session.user?.walletAddress;

  // TODO: Replace these with real values from your DB / chain
  const stats = {
    songsVerified: undefined as number | undefined,
    artists: undefined as number | undefined,
    nftsOwned: undefined as number | undefined,
    vibeCoins: undefined as number | undefined,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Soft animated background */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-70 pointer-events-none"
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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">👤 Profile</h1>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 grid place-items-center text-2xl font-bold">
                {name?.charAt(0) ?? "U"}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold truncate">{name}</h2>
                <p className="text-sm opacity-80 truncate">{email}</p>
                <p className="text-xs text-cyan-300 mt-1">
                  Wallet: {truncate(wallet)}
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats (fallbacks shown as —) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold mb-4">🎵 Music Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Songs Verified" value={stats.songsVerified} accent="text-cyan-300" />
              <Stat label="Artists" value={stats.artists} accent="text-emerald-300" />
              <Stat label="NFTs Owned" value={stats.nftsOwned} accent="text-fuchsia-300" />
              <Stat label="VibeCoin" value={stats.vibeCoins} accent="text-amber-300" />
            </div>
            <p className="text-[11px] opacity-60 mt-3">
              Tip: connect your accounts and run verification to populate these stats.
            </p>
          </div>

          {/* Top Artists (replace with live component/list later) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold mb-4">🏆 Top Artists</h3>
            <div className="space-y-2">
              {/* TODO: Replace with dynamic list from your verified likes */}
              <Row label="Top Artist #1" meta="— songs" />
              <Row label="Top Artist #2" meta="— songs" />
              <Row label="Top Artist #3" meta="— songs" />
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold mb-4">⚙ Settings</h3>
            <div className="space-y-4">
              <ToggleRow label="Notifications" defaultChecked />
              <ToggleRow label="Public Profile" defaultChecked />
              <ToggleRow label="Auto-verify Music" />
            </div>
          </div>

          {/* Account Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold mb-4">🔧 Account</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <GhostBtn>Edit Profile</GhostBtn>
              <GhostBtn>Privacy Settings</GhostBtn>
              <GhostBtn>Export Data</GhostBtn>
              <GhostBtn className="border-red-400/40 text-red-300 hover:bg-red-400/10">
                Sign Out
              </GhostBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small inline UI helpers (server-safe) ---------- */
function Stat({ label, value, accent }: { label: string; value?: number; accent?: string }) {
  return (
    <div className="text-center rounded-xl border border-white/10 bg-black/20 p-4">
      <div className={`text-2xl font-bold ${accent ?? ""}`}>{value ?? "—"}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

function Row({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-black/20">
      <span className="font-medium">{label}</span>
      <span className="text-xs opacity-70">{meta ?? ""}</span>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500/70"></div>
      </label>
    </div>
  );
}

function GhostBtn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`w-full text-left p-3 rounded-xl border border-white/10 hover:bg-white/5 transition ${className}`}
    >
      {children}
    </button>
  );
}