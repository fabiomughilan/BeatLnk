'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import WalletErrorBoundary from '../WalletErrorBoundary';

interface TokenMintingProps {
  onMintingComplete?: () => void;
}

export default function TokenMinting({ onMintingComplete }: TokenMintingProps) {
  const { data: session } = useSession();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');

  const generateSignatureRequest = async () => {
    if (!session?.user?.walletAddress) {
      setMintStatus('❌ No wallet address found in session');
      return;
    }

    const walletAddress = session.user.walletAddress;
    const amount = 100; // Fixed amount for now
    const contractAddress = '0xa473726d071e483c4960e27c13ed8f1427c3d687';
    const network = 'sepolia';

    const message = `I authorize minting ${amount} DataCoin tokens to my address ${walletAddress} on ${network} network. Contract: ${contractAddress}`;

    setMintStatus('📝 Please sign the message in your wallet to authorize token minting');
    
    // Show the message to the user
    console.log('Message to sign:', message);
    
    // In a real implementation, you would trigger wallet signing here
    // For now, we'll simulate it
    return { message, walletAddress, amount };
  };

  const handleMintTokens = async () => {
    try {
      setIsMinting(true);
      setMintStatus('');

      // Step 1: Generate signature request
      const signatureData = await generateSignatureRequest();
      
      if (!signatureData) {
        setMintStatus('❌ Failed to generate signature request');
        return;
      }

      // Step 2: Request signature from user's wallet
      // This would typically use a wallet connector like MetaMask
      setMintStatus('🔐 Please sign the message in your wallet...');
      
      // For demo purposes, we'll simulate the signature process
      // In production, you would use a wallet connector here
      const mockSignature = '0x' + 'mock_signature_' + Date.now();
      setSignature(mockSignature);

      // Step 3: Call minting API
      setMintStatus('🪙 Minting tokens...');
      
      const response = await fetch('/api/mint-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: signatureData.walletAddress,
          amount: signatureData.amount,
          message: signatureData.message,
          signature: mockSignature
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMintStatus('✅ Tokens minted successfully!');
        setTxHash(result.txHash);
        onMintingComplete?.();
      } else {
        setMintStatus(`❌ Minting failed: ${result.error}`);
      }

    } catch (error) {
      console.error('Minting error:', error);
      setMintStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <WalletErrorBoundary>
      <div className="space-y-4">
        {/* Token Minting Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🪙 Mint Your DataCoin Tokens</h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
            You've successfully verified your Spotify data! Now mint your exclusive DataCoin tokens as a reward.
          </p>
        </div>

        {/* Token Info */}
        <div className="bg-white/70 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">100</div>
              <div className="text-sm text-gray-600">DataCoin Tokens</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Free</div>
              <div className="text-sm text-gray-600">No Cost</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleMintTokens} 
            disabled={isMinting}
            className="w-full max-w-sm bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center space-x-3"
          >
            {isMinting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Minting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-lg">Mint Tokens</span>
              </>
            )}
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="text-2xl mb-1">🔐</div>
            <div className="text-sm font-medium text-gray-700">Secure</div>
            <div className="text-xs text-gray-600">Wallet Signed</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm font-medium text-gray-700">Fast</div>
            <div className="text-xs text-gray-600">Instant Mint</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="text-2xl mb-1">🎁</div>
            <div className="text-sm font-medium text-gray-700">Reward</div>
            <div className="text-xs text-gray-600">For Verification</div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {mintStatus && (
        <div className={`p-5 rounded-2xl border-2 shadow-lg ${
          mintStatus.includes('✅') || mintStatus.includes('successfully')
            ? 'bg-green-50 text-green-800 border-green-200' 
            : mintStatus.includes('❌') || mintStatus.includes('failed') || mintStatus.includes('Error')
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              mintStatus.includes('✅') || mintStatus.includes('successfully')
                ? 'bg-green-500' 
                : mintStatus.includes('❌') || mintStatus.includes('failed') || mintStatus.includes('Error')
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}>
              {mintStatus.includes('✅') || mintStatus.includes('successfully') ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : mintStatus.includes('❌') || mintStatus.includes('failed') || mintStatus.includes('Error') ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{mintStatus}</p>
              {mintStatus.includes('successfully') && (
                <p className="text-sm opacity-80">Your DataCoin tokens have been minted to your wallet</p>
              )}
            </div>
          </div>
          
          {/* Transaction Hash */}
          {txHash && (
            <div className="mt-4 p-4 bg-white/70 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">🔗 Transaction Hash</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 break-all">{txHash}</code>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View →
                </a>
              </div>
            </div>
          )}

          {/* Signature Info */}
          {signature && (
            <div className="mt-4 p-4 bg-white/70 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">🔐 Your Signature</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">{signature}</code>
            </div>
          )}
        </div>
      )}
      </div>
    </WalletErrorBoundary>
  );
}
