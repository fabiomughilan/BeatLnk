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
                  Verify your music taste with Spotify, store proofs on Filecoin, and discover your 
                  <span className="font-semibold"> top artists</span> and music preferences.
                </p>
              </div>
              <div className="hidden md:block">
                <Marble src={pfp} className="w-16 h-16" />
              </div>
            </div>
          </div>
        </section>

        {/* Core widgets */}
        <section className="w-full max-w-5xl space-y-6">
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
        </section>

      </Page.Main>
    </>
  );
}