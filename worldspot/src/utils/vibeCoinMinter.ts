import { ethers } from 'ethers';
import DataCoinABI from '../abi/DataCoin.js';

const DATACOIN_ADDRESS = '0xcc6ed169ef04494a1cc3d1441261754871ac782d';
const MINT_AMOUNT = '10'; // 10 VibeCoin per proof submission

export interface ProofComparison {
  isNewUser: boolean;
  hasChanges: boolean;
  changes: string[];
  shouldMint: boolean;
}

export async function compareProofs(currentProof: any, previousProof: any | null): Promise<ProofComparison> {
  // If no previous proof, user is new
  if (!previousProof) {
    return {
      isNewUser: true,
      hasChanges: true,
      changes: ['First proof submission'],
      shouldMint: true
    };
  }

  const changes: string[] = [];
  
  // Extract current and previous liked songs
  const currentLiked = currentProof?.publicData?.liked_songs || [];
  const previousLiked = previousProof?.publicData?.liked_songs || [];
  
  // Compare total song count
  if (currentLiked.length !== previousLiked.length) {
    const diff = currentLiked.length - previousLiked.length;
    changes.push(`Song count changed: ${diff > 0 ? '+' : ''}${diff} songs`);
  }
  
  // Compare artists
  const getCurrentArtists = (songs: any[]) => {
    const artists: Record<string, number> = {};
    songs.forEach(song => {
      song?.track?.artists?.forEach((artist: any) => {
        if (artist?.name) {
          artists[artist.name] = (artists[artist.name] || 0) + 1;
        }
      });
    });
    return artists;
  };
  
  const currentArtists = getCurrentArtists(currentLiked);
  const previousArtists = getCurrentArtists(previousLiked);
  
  // Check for new artists
  const newArtists = Object.keys(currentArtists).filter(artist => !previousArtists[artist]);
  if (newArtists.length > 0) {
    changes.push(`New artists: ${newArtists.slice(0, 3).join(', ')}${newArtists.length > 3 ? '...' : ''}`);
  }
  
  // Check for artist count changes
  Object.keys(currentArtists).forEach(artist => {
    const currentCount = currentArtists[artist];
    const previousCount = previousArtists[artist] || 0;
    const diff = currentCount - previousCount;
    
    if (diff > 0) {
      changes.push(`${artist}: +${diff} songs`);
    }
  });
  
  // Check for removed artists
  const removedArtists = Object.keys(previousArtists).filter(artist => !currentArtists[artist]);
  if (removedArtists.length > 0) {
    changes.push(`Removed artists: ${removedArtists.slice(0, 3).join(', ')}${removedArtists.length > 3 ? '...' : ''}`);
  }
  
  const hasChanges = changes.length > 0;
  
  return {
    isNewUser: false,
    hasChanges,
    changes,
    shouldMint: hasChanges
  };
}

export function prepareMintTransaction(walletAddress: string): { to: string; value: string; data: string } {
  try {
    console.log(`🪙 Preparing mint transaction for ${MINT_AMOUNT} VibeCoin to ${walletAddress}`);
    
    // Create contract interface for encoding using the full DataCoin ABI
    const iface = new ethers.Interface(DataCoinABI);
    
    // Encode the mint function call
    const mintAmount = ethers.parseUnits(MINT_AMOUNT, 18);
    const data = iface.encodeFunctionData('mint', [walletAddress, mintAmount]);
    
    console.log(`📝 Transaction prepared:`, {
      contract: DATACOIN_ADDRESS,
      function: 'mint',
      recipient: walletAddress,
      amount: `${MINT_AMOUNT} VibeCoin`
    });
    
    return {
      to: DATACOIN_ADDRESS,
      value: '0', // No ETH value needed for minting
      data: data
    };
    
  } catch (error) {
    console.error('❌ Failed to prepare mint transaction:', error);
    throw new Error('Failed to prepare mint transaction');
  }
}

export function generateMintReason(comparison: ProofComparison): string {
  if (comparison.isNewUser) {
    return 'First Spotify verification';
  }
  
  if (comparison.changes.length === 1) {
    return comparison.changes[0];
  }
  
  return `Music library updated: ${comparison.changes.slice(0, 2).join(', ')}${comparison.changes.length > 2 ? '...' : ''}`;
}
