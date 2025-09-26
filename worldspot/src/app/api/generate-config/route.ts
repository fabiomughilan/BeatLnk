import { NextRequest, NextResponse } from 'next/server';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export async function GET(req: NextRequest) {
  try {
    const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
    const APP_SECRET = process.env.NEXT_PUBLIC_SECRET;
    const PROVIDER_ID = process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID;

    if (!APP_ID || !APP_SECRET || !PROVIDER_ID) {
      return NextResponse.json({ 
        error: 'Missing Reclaim environment variables' 
      }, { status: 500 });
    }

    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
    
    // Set the callback URL for receiving proofs
    const BASE_URL = 'https://82f141aa390b.ngrok-free.app';
    reclaimProofRequest.setAppCallbackUrl(BASE_URL + '/api/receive-proofs');
    
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    return NextResponse.json({ reclaimProofRequestConfig });
    
  } catch (error) {
    console.error('Error generating request config:', error);
    return NextResponse.json({ 
      error: 'Failed to generate request config' 
    }, { status: 500 });
  }
}
