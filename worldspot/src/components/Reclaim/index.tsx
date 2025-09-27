'use client';
import { useState } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import { MiniKit } from '@worldcoin/minikit-js';
import DataCoinABI from '../../abi/DataCoin.js';
 
function Reclaim() {
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [vibeCoinStatus, setVibeCoinStatus] = useState<string>('');
  const [mintTxHash, setMintTxHash] = useState<string>('');
 
  const uploadToLighthouse = async (proofs: any) => {
    try {
      setUploadStatus('Uploading to Lighthouse...');
      
      const response = await fetch('https://82f141aa390b.ngrok-free.app/api/upload-to-lighthouse', {
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
      const response = await fetch('https://82f141aa390b.ngrok-free.app/api/generate-config');
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

          // Check VibeCoin minting status from proof response
          if (proofs.vibeCoin) {
            if (proofs.vibeCoin.shouldMint && proofs.vibeCoin.mintTransaction) {
              // Execute VibeCoin mint transaction using WorldCoin MiniKit
              setVibeCoinStatus('🔄 Processing VibeCoin mint...');
              try {
                console.log('🔄 Sending VibeCoin mint transaction via WorldCoin MiniKit');
                console.log('Transaction details:', {
                  to: proofs.vibeCoin.mintTransaction.to,
                  value: proofs.vibeCoin.mintTransaction.value,
                  data: proofs.vibeCoin.mintTransaction.data.slice(0, 20) + '...'
                });

                const mintResult = await MiniKit.commandsAsync.sendTransaction({
                  transaction: [
                    {
                      address: proofs.vibeCoin.mintTransaction.to,
                      value: proofs.vibeCoin.mintTransaction.value,
                      calldata: proofs.vibeCoin.mintTransaction.data
                    }
                  ]
                });

                if (mintResult?.finalPayload?.status === 'success') {
                  setVibeCoinStatus(`🪙 Earned 10 VibeCoin! ${proofs.vibeCoin.reason}`);
                  setMintTxHash(mintResult.finalPayload.transaction_id);
                } else {
                  setVibeCoinStatus(`❌ VibeCoin minting failed: ${mintResult?.finalPayload?.error_code || 'Unknown error'}`);
                }
              } catch (mintError) {
                console.error('VibeCoin minting error:', mintError);
                setVibeCoinStatus(`❌ VibeCoin minting failed`);
              }
            } else if (!proofs.vibeCoin.shouldMint) {
              setVibeCoinStatus(`⏭️ ${proofs.vibeCoin.reason}`);
            } else {
              setVibeCoinStatus(`❌ VibeCoin minting preparation failed`);
            }
          }

          // Automatically upload to Lighthouse after successful verification
          await uploadToLighthouse(proofs);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setIsLoading(false);
          setUploadStatus('Verification failed');
          setVibeCoinStatus('');
          setMintTxHash('');
        },
      });

    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setIsLoading(false);
      setUploadStatus('Initialization failed');
    }
  };
 
  return (
    <div className="space-y-6">
      {/* Verification Card */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Spotify Data</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connect your Spotify account to verify your music preferences and unlock exclusive NFTs based on your top artists.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex-shrink-0">
            <button 
              onClick={handleVerification} 
              disabled={isLoading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>Start Verification</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      {vibeCoinStatus && (
        <div className={`p-4 rounded-lg ${
          vibeCoinStatus.includes('Earned')
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : vibeCoinStatus.includes('failed')
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            {vibeCoinStatus.includes('Earned') ? (
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            ) : vibeCoinStatus.includes('failed') ? (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="font-medium">{vibeCoinStatus}</p>
          </div>
          {mintTxHash && (
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-700">Transaction Hash:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1 break-all">{mintTxHash}</code>
              <a 
                href={`https://worldchain-mainnet.explorer.alchemy.com/tx/${mintTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                View on WorldChain Explorer →
              </a>
            </div>
          )}
        </div>
      )}

      {uploadStatus && (
        <div className={`p-4 rounded-lg ${
          uploadStatus.includes('Successfully') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : uploadStatus.includes('failed') || uploadStatus.includes('error')
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadStatus.includes('Successfully') ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : uploadStatus.includes('failed') || uploadStatus.includes('error') ? (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="font-medium">{uploadStatus}</p>
          </div>
          {ipfsHash && (
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-700">IPFS Hash:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1 break-all">{ipfsHash}</code>
              <p className="text-sm text-gray-600 mt-2">Your Spotify data is now securely stored on IPFS!</p>
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
