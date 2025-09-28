'use client';

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';

function truncate(addr?: string, left = 6, right = 4) {
  if (!addr) return "Not connected";
  if (addr.length <= left + right) return addr;
  return `${addr.slice(0, left)}…${addr.slice(-right)}`;
}

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

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
      {/* Professional gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1e293b 50%, #0f0f0f 100%)',
        }}
      />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">User Profile</h1>
          <p className="text-gray-300">Manage your account and music preferences</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-4">
              <Marble 
                src="/image1.png" 
                className="w-20 h-20" 
              />
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold text-white truncate">{name}</h2>
                <p className="text-sm text-gray-300 truncate">{email}</p>
                <p className="text-xs text-blue-400 mt-1">
                  Wallet: {truncate(wallet)}
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats (fallbacks shown as —) */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">🎵 Music Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Songs Verified" value={stats.songsVerified} accent="text-blue-400" />
              <Stat label="Artists" value={stats.artists} accent="text-green-400" />
              <Stat label="NFTs Owned" value={stats.nftsOwned} accent="text-purple-400" />
              <Stat label="VibeCoin" value={stats.vibeCoins} accent="text-yellow-400" />
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Tip: connect your accounts and run verification to populate these stats.
            </p>
          </div>

          {/* Top Artists (replace with live component/list later) */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">🏆 Top Artists</h3>
            <div className="space-y-2">
              {/* TODO: Replace with dynamic list from your verified likes */}
              <Row label="Top Artist #1" meta="— songs" />
              <Row label="Top Artist #2" meta="— songs" />
              <Row label="Top Artist #3" meta="— songs" />
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">⚙ Settings</h3>
            <div className="space-y-4">
              <ToggleRow label="Notifications" defaultChecked />
              <ToggleRow label="Public Profile" defaultChecked />
              <ToggleRow label="Auto-verify Music" />
            </div>
          </div>

          {/* Account Actions */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">🔧 Account</h3>
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

/* ---------- Small inline UI helpers (client-safe) ---------- */
function Stat({ label, value, accent }: { label: string; value?: number; accent?: string }) {
  return (
    <div className="text-center rounded-lg border border-white/10 bg-white/5 p-4">
      <div className={`text-2xl font-bold ${accent ?? "text-white"}`}>{value ?? "—"}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
}

function Row({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg border border-white/10 bg-white/5">
      <span className="font-medium text-white">{label}</span>
      <span className="text-xs text-gray-400">{meta ?? ""}</span>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500/70"></div>
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
      className={`w-full text-left p-3 rounded-lg border border-white/10 hover:bg-white/5 transition text-white ${className}`}
    >
      {children}
    </button>
  );
}