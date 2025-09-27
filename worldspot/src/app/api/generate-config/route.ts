import { NextRequest, NextResponse } from 'next/server';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import { auth } from '@/auth';

export async function GET() {
  try {
    // Get current session to include wallet address
    const session = await auth();
    const walletAddress = session?.user?.walletAddress || session?.user?.id || 'unknown';
    

    const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
    const APP_SECRET = process.env.NEXT_PUBLIC_SECRET;
    const PROVIDER_ID = process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID;

    if (!APP_ID || !APP_SECRET || !PROVIDER_ID) {
      return NextResponse.json({ 
        error: 'Missing Reclaim environment variables' 
      }, { status: 500 });
    }

    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
    
    // Set the callback URL with wallet address as query parameter
<<<<<<< HEAD
    const BASE_URL = 'https://97b4ca846410.ngrok-free.app';
=======
    const BASE_URL = 'https://82f141aa390b.ngrok-free.app';
>>>>>>> parent of a7acd92 (changes)
    const callbackUrl = `${BASE_URL}/api/receive-proofs?wallet=${encodeURIComponent(walletAddress)}`;
    reclaimProofRequest.setAppCallbackUrl(callbackUrl);
    
    
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    return NextResponse.json({ reclaimProofRequestConfig });
    
  } catch (error) {
    console.error('Error generating request config:', error);
    return NextResponse.json({ 
      error: 'Failed to generate request config' 
    }, { status: 500 });
  }
}
