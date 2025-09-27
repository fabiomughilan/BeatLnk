import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import Reclaim from '@/components/Reclaim';
import TopArtists from '@/components/TopArtists';

export default async function Home() {
  const session = await auth();
  const username = session?.user?.username ?? 'you';
  const pfp = session?.user?.profilePictureUrl ?? undefined;

  // --- Server-side perk timing (example) ---
  // Set your real next event timestamp here (ISO string or unix ms)
  const nextEventAt = new Date('2025-11-15T18:30:00Z'); // sample
  const now = new Date();
  const msLeft = Math.max(0, nextEventAt.getTime() - now.getTime());
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  return (
    <>
      {/* Subtle animated gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-70 bg-gradient-radial animate-bg-shift"
        style={{
          backgroundImage:
            'radial-gradient(60rem 40rem at 20% 20%, rgba(14,165,233,.15), transparent), radial-gradient(60rem 60rem at 80% 70%, rgba(99,102,241,.15), transparent)',
          backgroundSize: '200% 200%',
        }}
      />

      <Page.Header className="p-0 sticky top-0 z-40">
        <TopBar
          title="Home"
          endAdornment={
            <div className="flex items-center gap-2 pr-2">
              <p className="text-sm font-semibold capitalize">{username}</p>
              <Marble src={pfp} className="w-10 h-10" />
            </div>
          }
        />
      </Page.Header>

      <Page.Main className="flex flex-col items-center justify-start gap-6 mb-20">
        {/* Hero / greeting */}
        <section className="w-full max-w-5xl pt-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Welcome back, <span className="capitalize">{username}</span> 👋
                </h1>
                <p className="text-sm opacity-80 mt-1">
                  Verify your vibes, anchor to <span className="font-semibold">VibeCoin</span> on World mainnet,
                  store proofs on Filecoin, and claim <span className="font-semibold">limited-edition posters</span> or your
                  <span className="font-semibold"> next-event pass</span>.
                </p>
              </div>
              <div className="hidden md:block">
                <Marble src={pfp} className="w-16 h-16" />
              </div>
            </div>
          </div>
        </section>

        {/* Core widgets */}
        <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: profile/user data */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-0">
              <div className="border-b border-white/10 px-5 py-3">
                <h2 className="text-base font-semibold">Your Profile</h2>
              </div>
              <div className="p-5">
                <UserInfo />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-0">
              <div className="border-b border-white/10 px-5 py-3">
                <h2 className="text-base font-semibold">Reclaim Verification</h2>
              </div>
              <div className="p-5">
                <Reclaim />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-0">
              <div className="border-b border-white/10 px-5 py-3">
                <h2 className="text-base font-semibold">Your Top Artists</h2>
              </div>
              <div className="p-5">
                <TopArtists />
              </div>
            </div>
          </div>

          {/* Right column: quick actions + status */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left hover:scale-[1.02] transition">
                  <div className="text-sm font-medium">Verify Likes</div>
                  <div className="text-xs opacity-70">Sync your music taste</div>
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left hover:scale-[1.02] transition">
                  <div className="text-sm font-medium">Anchor Proof</div>
                  <div className="text-xs opacity-70">Write to VibeCoin</div>
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left hover:scale-[1.02] transition">
                  <div className="text-sm font-medium">Store to Filecoin</div>
                  <div className="text-xs opacity-70">Persist payload (CID)</div>
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left hover:scale-[1.02] transition">
                  <div className="text-sm font-medium">Claim Perks</div>
                  <div className="text-xs opacity-70">Poster / Event pass</div>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              <h3 className="text-sm font-semibold">Status</h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">World ID</span>
                  <span className="rounded-full bg-emerald-400/15 text-emerald-300 px-2 py-0.5">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">VibeCoin</span>
                  <span className="rounded-full bg-cyan-400/15 text-cyan-300 px-2 py-0.5">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Filecoin</span>
                  <span className="rounded-full bg-indigo-400/15 text-indigo-300 px-2 py-0.5">Configured</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-1/2 bg-white/80" />
                </div>
                <p className="text-xs opacity-70 mt-2">Pipeline progress (demo)</p>
              </div>
            </div>
          </aside>
        </section>

        {/* Perks: Limited-Edition Poster + Next-Event Pass */}
        <section className="w-full max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
            <h2 className="text-base font-semibold mb-4">Your Perks</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Poster perk */}
              <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                <div className="relative">
                  <img
                    src="https://picsum.photos/seed/poster-v1/800/500"
                    alt="Limited edition poster"
                    className="w-full h-44 object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs">
                    Edition #17 / 250
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Limited-Edition Poster</span>
                    <span className="ml-auto rounded-full bg-amber-400/15 text-amber-300 px-2 py-0.5 text-xs">
                      Unclaimed
                    </span>
                  </div>
                  <p className="text-xs opacity-75 mt-1">
                    High-quality print shipped after verification. One per account.
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href="#claim-poster"
                      className="rounded-full bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                    >
                      Claim Poster
                    </a>
                    <button
                      disabled
                      className="rounded-full border border-white/15 px-4 py-2 text-sm opacity-60 cursor-not-allowed"
                      title="Transfer coming soon"
                    >
                      Transfer (soon)
                    </button>
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Proof CID</span>
                      <code className="opacity-90">bafy…3a9d</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event pass perk */}
              <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-44 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs">
                    Next Event {daysLeft > 0 ? `in ${daysLeft}d` : '— today'}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Event Pass (General)</span>
                    <span className="ml-auto rounded-full bg-emerald-400/15 text-emerald-300 px-2 py-0.5 text-xs">
                      Active
                    </span>
                  </div>
                  <p className="text-xs opacity-75 mt-1">
                    Show this pass at entry. Valid for the next artist event. Non-transferable.
                  </p>

                  <div className="mt-3 grid grid-cols-[96px_1fr] gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 h-24 flex items-center justify-center text-[10px] opacity-80">
                      QR / NFC
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Date</span>
                        <span>{nextEventAt.toUTCString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Holder</span>
                        <span className="capitalize">{username}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Policy</span>
                        <span>1 device • ID check</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href="#add-wallet-pass"
                      className="rounded-full bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                    >
                      Add to Wallet
                    </a>
                    <a
                      href="#view-qr"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5 transition"
                    >
                      View QR
                    </a>
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Pass ID</span>
                      <code className="opacity-90">PASS-GN-0xA91c</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiny helper text */}
            <p className="text-[11px] opacity-60 mt-3">
              Perks are tied to your VibeCoin proof on World mainnet. Poster edition numbers and pass tier are assigned on claim.
            </p>
          </div>
        </section>
      </Page.Main>
    </>
  );
}