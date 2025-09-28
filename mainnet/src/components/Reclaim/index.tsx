'use client';
import { useState } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import TokenMinting from '../TokenMinting';
 
function Reclaim() {
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [showTokenMinting, setShowTokenMinting] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'connecting' | 'verifying' | 'uploading' | 'complete'>('idle');
 
  const uploadToLighthouse = async (proofs: any) => {
    try {
      setVerificationStep('uploading');
      setUploadStatus('Uploading to Lighthouse...');
      
      const response = await fetch('/api/upload-to-lighthouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proofs
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setVerificationStep('complete');
        setUploadStatus('Successfully uploaded to IPFS!');
        setIpfsHash(result.hash);
        console.log('IPFS Hash:', result.hash);
        // Show token minting option after successful upload
        setShowTokenMinting(true);
      } else {
        setUploadStatus(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Lighthouse upload error:', error);
      setUploadStatus(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

 
  const handleVerification = async () => {
    try {
      setIsLoading(true);
      setVerificationStep('connecting');
      setUploadStatus('');
      setIpfsHash('');

      // Step 1: Fetch the configuration from your backend
      const response = await fetch('/api/generate-config');
      const { reclaimProofRequestConfig } = await response.json();

      // Step 2: Initialize the ReclaimProofRequest with the received configuration
      setVerificationStep('verifying');
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);

      // Step 3: Trigger the verification flow automatically
      // This method detects the user's platform and provides the optimal experience:
      // - Browser extension for desktop users (if installed)
      // - QR code modal for desktop users (fallback)
      // - Native app clips for mobile users
      await reclaimProofRequest.triggerReclaimFlow();
 
      // Step 4: Start listening for proof submissions
      await reclaimProofRequest.startSession({
        onSuccess: async (proofs) => {
          console.log('Successfully created proof', proofs);
          setProofs(proofs);
          setIsLoading(false);

          // Upload to Lighthouse
          await uploadToLighthouse(proofs);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setIsLoading(false);
          setVerificationStep('idle');
          setUploadStatus('Verification failed');
        },
      });

    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setIsLoading(false);
      setVerificationStep('idle');
      setUploadStatus('Initialization failed');
    }
  };
 
  return (
    <div className="space-y-6">
      {/* Spotify Verification Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Connect Your Spotify</h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-md mx-auto">
            Verify your music preferences to unlock personalized features and connect with like-minded music lovers
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleVerification} 
            disabled={isLoading}
            className="w-full max-w-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">
                  {verificationStep === 'connecting' && 'Connecting to Spotify...'}
                  {verificationStep === 'verifying' && 'Verifying your account...'}
                  {verificationStep === 'uploading' && 'Uploading data...'}
                </span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-lg">Connect Spotify</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Indicator */}
        {isLoading && (
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${verificationStep === 'connecting' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <div className={`w-3 h-3 rounded-full ${verificationStep === 'verifying' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <div className={`w-3 h-3 rounded-full ${verificationStep === 'uploading' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-400">
              {verificationStep === 'connecting' && 'Establishing connection...'}
              {verificationStep === 'verifying' && 'Verifying your Spotify data...'}
              {verificationStep === 'uploading' && 'Storing your data securely...'}
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-white">Personalized</div>
            <div className="text-xs text-gray-400">Music Recommendations</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🎤</div>
            <div className="text-sm font-medium text-white">Community</div>
            <div className="text-xs text-gray-400">Music Chat Rooms</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-medium text-white">Analytics</div>
            <div className="text-xs text-gray-400">Your Music Stats</div>
          </div>
        </div>
      </div>
      

      {uploadStatus && (
        <div className={`p-5 rounded-lg border shadow-lg ${
          uploadStatus.includes('Successfully') 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : uploadStatus.includes('failed') || uploadStatus.includes('error')
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              uploadStatus.includes('Successfully') 
                ? 'bg-green-500' 
                : uploadStatus.includes('failed') || uploadStatus.includes('error')
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}>
              {uploadStatus.includes('Successfully') ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : uploadStatus.includes('failed') || uploadStatus.includes('error') ? (
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
              <p className="font-semibold text-lg">{uploadStatus}</p>
              {uploadStatus.includes('Successfully') && (
                <p className="text-sm opacity-80">Your music data has been securely stored on IPFS</p>
              )}
            </div>
          </div>
          {ipfsHash && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm font-semibold text-white mb-2">📦 IPFS Storage</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-black/20 px-2 py-1 rounded flex-1 break-all text-gray-300">{ipfsHash}</code>
                <a 
                  href={`https://gateway.lighthouse.storage/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Proof Data */}
      {proofs && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verification Successful!</span>
            </h3>
          </div>
          <div className="p-4">
            <details className="cursor-pointer group">
              <summary className="font-medium text-gray-300 hover:text-white flex items-center space-x-2">
                <svg className="w-4 h-4 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>View Proof Data</span>
              </summary>
              <div className="mt-3 p-3 bg-black/20 rounded border border-white/10 overflow-auto max-h-96">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(proofs, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Token Minting Section - Shows after successful verification */}
      {showTokenMinting && (
        <div className="mt-6">
          <TokenMinting 
            onMintingComplete={() => {
              console.log('Token minting completed!');
              // You can add additional logic here if needed
            }}
          />
        </div>
      )}

    </div>
  );
}
 
export default Reclaim;
