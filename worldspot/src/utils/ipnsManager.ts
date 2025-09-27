import lighthouse from '@lighthouse-web3/sdk';

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API!;

// Store user IPNS keys in memory (in production, use database)
const userIpnsKeys: Record<string, string> = {};

export async function getUserIpnsKey(walletAddress: string): Promise<{ipnsName: string, ipnsId: string}> {
  // Check if user already has an IPNS key
  if (userIpnsKeys[walletAddress]) {
    // Return stored key info (in production, store both name and ID)
    return {
      ipnsName: userIpnsKeys[walletAddress],
      ipnsId: `k51qzi5uqu5d${userIpnsKeys[walletAddress].slice(8)}` // Mock ID for now
    };
  }

  try {
    // Generate new IPNS key for user using wallet address as identifier
    const keyResponse = await lighthouse.generateKey(LIGHTHOUSE_API_KEY);
    
    /* Expected response format:
    {
      data: {
        "ipnsName": "6cda213e3a534f8388665dee77a26458",
        "ipnsId": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu"
      }
    }
    */
    
    const ipnsName = keyResponse.data.ipnsName;
    const ipnsId = keyResponse.data.ipnsId;
    
    // Store the key for this wallet address
    userIpnsKeys[walletAddress] = ipnsName;
    
    console.log(`🔑 Generated IPNS key for wallet ${walletAddress}:`);
    console.log(`   Name: ${ipnsName}`);
    console.log(`   ID: ${ipnsId}`);
    console.log(`   Access: https://gateway.lighthouse.storage/ipns/${ipnsId}`);
    
    return { ipnsName, ipnsId };
  } catch (error) {
    console.error('Error generating IPNS key:', error);
    throw new Error('Failed to generate IPNS key');
  }
}

export async function updateUserProofs(walletAddress: string, newProof: any): Promise<{ipnsId: string, gatewayUrl: string}> {
  try {
    // Get user's IPNS key
    const keyInfo = await getUserIpnsKey(walletAddress);
    
    // Get existing proofs from IPNS (if any)
    let existingProofs: any[] = [];
    try {
      // Try to get existing record from IPNS using Lighthouse gateway
      const response = await fetch(`https://gateway.lighthouse.storage/ipns/${keyInfo.ipnsId}`);
      if (response.ok) {
        const data = await response.json();
        existingProofs = Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      // No existing data, start fresh
      console.log('No existing IPNS record found, starting fresh');
    }
    
    // Add new proof to the array
    const updatedProofs = [...existingProofs, {
      ...newProof,
      addedAt: new Date().toISOString(),
      proofId: `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress
    }];
    
    // Upload updated proofs to IPFS
    const proofsText = JSON.stringify(updatedProofs, null, 2);
    const uploadResponse = await lighthouse.uploadText(
      proofsText,
      LIGHTHOUSE_API_KEY,
      `wallet-${walletAddress}-proofs-${Date.now()}`
    );
    
    if (!uploadResponse.data) {
      throw new Error('Failed to upload proofs to IPFS');
    }
    
    // Update IPNS record to point to new CID
    const pubResponse = await lighthouse.publishRecord(
      uploadResponse.data.Hash,
      keyInfo.ipnsName,
      LIGHTHOUSE_API_KEY
    );
    
    /* Expected response format:
    {
      data: {
        "Name": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu",
        "Value": "/ipfs/Qmd5MBBScDUV3Ly8qahXtZFqyRRfYSmUwEcxpYcV4hzKfW"
      }
    }
    */
    
    const gatewayUrl = `https://gateway.lighthouse.storage/ipns/${keyInfo.ipnsId}`;
    
    console.log(`📝 Updated IPNS for wallet ${walletAddress}:`);
    console.log(`   IPNS Name: ${pubResponse.data.Name}`);
    console.log(`   IPFS Path: ${pubResponse.data.Value}`);
    console.log(`   Gateway URL: ${gatewayUrl}`);
    
    return {
      ipnsId: keyInfo.ipnsId,
      gatewayUrl
    };
    
  } catch (error) {
    console.error('Error updating user proofs:', error);
    throw new Error('Failed to update user proofs');
  }
}

export async function getUserProofs(walletAddress: string): Promise<any[]> {
  try {
    // First, try to get from in-memory cache
    let keyInfo;
    if (userIpnsKeys[walletAddress]) {
      keyInfo = await getUserIpnsKey(walletAddress);
    } else {
      // If not in memory, try to find it by scanning all IPNS keys
      try {
        const allKeys = await lighthouse.getAllKeys(LIGHTHOUSE_API_KEY);
        
        if (allKeys.data && allKeys.data.length > 0) {
          // Try each key to see if it contains data for our wallet
          for (const key of allKeys.data) {
            try {
              const testResponse = await fetch(`https://gateway.lighthouse.storage/ipns/${key.ipnsId}`, {
                signal: AbortSignal.timeout(5000) // 5 second timeout
              });
              
              if (testResponse.ok) {
                const testData = await testResponse.json();
                const dataArray = Array.isArray(testData) ? testData : [testData];
                
                // Check if any proof in this IPNS record matches our wallet
                const hasMatchingWallet = dataArray.some(proof => {
                  const proofWallet = proof?.claimData?.context ? 
                    JSON.parse(proof.claimData.context).extractedParameters?.walletAddress : null;
                  return proofWallet === walletAddress;
                });
                
                if (hasMatchingWallet) {
                  // Cache it for future use
                  userIpnsKeys[walletAddress] = key.ipnsName;
                  keyInfo = { ipnsName: key.ipnsName, ipnsId: key.ipnsId };
                  break;
                }
              }
            } catch (testError) {
              // Skip this key and try the next one
              continue;
            }
          }
        }
      } catch (getAllError) {
        // Silently handle error
      }
    }
    
    if (!keyInfo) {
      return [];
    }
    
    // Fetch from IPNS using Lighthouse gateway
    const response = await fetch(`https://gateway.lighthouse.storage/ipns/${keyInfo.ipnsId}`);
    if (!response.ok) {
      return [];
    }
    
    const proofData = await response.json();
    const result = Array.isArray(proofData) ? proofData : [proofData];
    
    return result;
    
  } catch (error) {
    console.error('Error getting user proofs:', error);
    return [];
  }
}

export async function getLatestUserProof(walletAddress: string): Promise<any | null> {
  try {
    const proofs = await getUserProofs(walletAddress);
    return proofs.length > 0 ? proofs[proofs.length - 1] : null;
  } catch (error) {
    console.error('Error getting latest user proof:', error);
    return null;
  }
}

export async function getAllUserKeys(): Promise<any[]> {
  try {
    const allKeys = await lighthouse.getAllKeys(LIGHTHOUSE_API_KEY);
    return allKeys.data || [];
  } catch (error) {
    console.error('Error getting all IPNS keys:', error);
    return [];
  }
}

export async function removeUserKey(walletAddress: string): Promise<boolean> {
  try {
    if (!userIpnsKeys[walletAddress]) {
      return false;
    }
    
    const ipnsName = userIpnsKeys[walletAddress];
    const removeRes = await lighthouse.removeKey(ipnsName, LIGHTHOUSE_API_KEY);
    
    // Remove from local storage
    delete userIpnsKeys[walletAddress];
    
    console.log(`🗑️ Removed IPNS key for wallet ${walletAddress}`);
    return true;
  } catch (error) {
    console.error('Error removing IPNS key:', error);
    return false;
  }
}

