'use client';
import { useState } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
 
function Reclaim() {
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');
 
  const uploadToLighthouse = async (proofs: any) => {
    try {
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
        setUploadStatus('Successfully uploaded to IPFS!');
        setIpfsHash(result.hash);
        console.log('IPFS Hash:', result.hash);
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
      setUploadStatus('');
      setIpfsHash('');

      // Step 1: Fetch the configuration from your backend
      const response = await fetch('/api/generate-config');
      const { reclaimProofRequestConfig } = await response.json();

      // Step 2: Initialize the ReclaimProofRequest with the received configuration
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
          setUploadStatus('Verification failed');
        },
      });

    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setIsLoading(false);
      setUploadStatus('Initialization failed');
    }
  };
 
  return (
    <div className="space-y-4">
      {/* Spotify Verification Card */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🎵 Connect Your Spotify</h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
            Verify your music taste to discover people with similar preferences and join exclusive music rooms
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleVerification} 
            disabled={isLoading}
            className="w-full max-w-sm bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-lg">Start Verification</span>
              </>
            )}
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-medium text-gray-700">Find Similar</div>
            <div className="text-xs text-gray-600">Music Taste</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="text-2xl mb-1">🎤</div>
            <div className="text-sm font-medium text-gray-700">Join Rooms</div>
            <div className="text-xs text-gray-600">Music Chat</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm font-medium text-gray-700">Top Artists</div>
            <div className="text-xs text-gray-600">Your Profile</div>
          </div>
        </div>
      </div>
      

      {uploadStatus && (
        <div className={`p-5 rounded-2xl border-2 shadow-lg ${
          uploadStatus.includes('Successfully') 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : uploadStatus.includes('failed') || uploadStatus.includes('error')
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
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
                <p className="text-sm opacity-80">Your music data has been securely stored</p>
              )}
            </div>
          </div>
          {ipfsHash && (
            <div className="mt-4 p-4 bg-white/70 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">📦 IPFS Storage</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 break-all">{ipfsHash}</code>
                <a 
                  href={`https://gateway.lighthouse.storage/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verification Successful!</span>
            </h3>
          </div>
          <div className="p-4">
            <details className="cursor-pointer group">
              <summary className="font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2">
                <svg className="w-4 h-4 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>View Proof Data</span>
              </summary>
              <div className="mt-3 p-3 bg-gray-50 rounded border overflow-auto max-h-96">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(proofs, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}

    </div>
  );
}
 
export default Reclaim;
