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
      {/* Professional gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1e293b 50%, #0f0f0f 100%)',
        }}
      />

      <Page.Header className="p-0 sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <TopBar
          title="Dashboard"
          endAdornment={
            <div className="flex items-center gap-3 pr-2">
              <p className="text-sm font-medium text-white">{username}</p>
              <Marble 
                src="/image1.png" 
                className="w-8 h-8" 
              />
            </div>
          }
        />
      </Page.Header>

      <Page.Main className="flex flex-col items-center justify-start gap-6 mb-20">
        {/* Hero / greeting */}
        <section className="w-full max-w-5xl pt-4">
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white">
                  Welcome back, <span className="text-blue-400">{username}</span>
                </h1>
                <p className="text-sm text-gray-300 mt-2">
                  Verify your music preferences with Spotify, store proofs on Filecoin, and analyze your 
                  <span className="font-medium text-blue-400"> top artists</span> and listening patterns.
                </p>
              </div>
              <div className="hidden md:block">
                <Marble 
                  src="/image1.png" 
                  className="w-16 h-16" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core widgets */}
        <section className="w-full max-w-5xl space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">User Profile</h2>
              </div>
              <div className="p-6">
                <UserInfo />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Spotify Verification</h2>
              </div>
              <div className="p-6">
                <Reclaim />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Music Analytics</h2>
              </div>
              <div className="p-6">
                <TopArtists />
              </div>
            </div>
        </section>

      </Page.Main>
    </>
  );
}