import { Page } from '../components/PageLayout';
import AuthButton from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-12 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <span className="text-8xl mb-6 block">🎵</span>
            <h1 className="text-6xl font-bold mb-6 text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              Welcome to LnK
            </h1>
            <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
              Verify your Spotify music taste and unlock exclusive NFTs based on your favorite artists
            </p>
          </div>
          
          <div className="mb-12">
            <AuthButton />
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Wallet Connection</h3>
              <p className="text-gray-600">Connect your Web3 wallet securely using RainbowKit</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="text-4xl mb-4">🎶</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Spotify Verification</h3>
              <p className="text-gray-600">Prove your music taste with Reclaim Protocol verification</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Earn NFTs</h3>
              <p className="text-gray-600">Unlock exclusive NFTs when you have 10+ songs from an artist</p>
            </div>
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
