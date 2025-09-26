import { useState } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import { signMessageWithBrowserWallet } from '@/utils/wallet-signing';
 
function Reclaim() {
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');
 
  const uploadToLighthouse = async (proofs: any) => {
    try {
      setUploadStatus('Signing message and uploading to Lighthouse...');
      
      // Sign message with user's wallet
      const message = `Upload Spotify verification data: ${Date.now()}`;
      const { publicKey, signedMessage } = await signMessageWithBrowserWallet(message);
      
      const response = await fetch('/api/upload-to-lighthouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proofs,
          publicKey,
          signedMessage
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
      const response = await fetch('/api/reclaim-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { reclaimProofRequestConfig } = await response.json();

      // Step 2: Initialize the ReclaimProofRequest with the received configuration
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);

      // Step 3: Trigger the verification flow automatically
      await reclaimProofRequest.triggerReclaimFlow();

      // Step 4: Start listening for proof submissions
      await reclaimProofRequest.startSession({
        onSuccess: async (proofs) => {
          console.log('Successfully created proof', proofs);
          setProofs(proofs);
          setIsLoading(false);
          
          // Automatically upload to Lighthouse after successful verification
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
      <button 
        onClick={handleVerification} 
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Verifying...' : 'Start Spotify Verification'}
      </button>
      
      {uploadStatus && (
        <div className={`p-4 rounded-lg ${
          uploadStatus.includes('Successfully') 
            ? 'bg-green-100 text-green-800' 
            : uploadStatus.includes('failed') || uploadStatus.includes('error')
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          <p className="font-medium">{uploadStatus}</p>
          {ipfsHash && (
            <div className="mt-2">
              <p className="text-sm">IPFS Hash: <code className="bg-gray-200 px-2 py-1 rounded">{ipfsHash}</code></p>
              <p className="text-sm mt-1">Your Spotify data is now securely stored on IPFS!</p>
            </div>
          )}
        </div>
      )}
      
      {proofs && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Verification Successful!</h2>
          <details className="cursor-pointer">
            <summary className="font-medium text-gray-700">View Proof Data</summary>
            <pre className="mt-2 text-sm bg-white p-3 rounded border overflow-auto max-h-96">
              {JSON.stringify(proofs, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
 
export default Reclaim;