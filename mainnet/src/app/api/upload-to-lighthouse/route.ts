import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import lighthouse from '@lighthouse-web3/sdk';
import { storeIpfsHash } from '@/utils/artistDataStore';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proofs } = await req.json();

    if (!proofs) {
      return NextResponse.json({ 
        error: 'Missing required field: proofs' 
      }, { status: 400 });
    }

    // Convert proofs to JSON string for upload
    const proofsText = JSON.stringify(proofs, null, 2);
    
    // Upload JSON data to Lighthouse (unencrypted)
    const response = await lighthouse.uploadText(
      proofsText,
      process.env.LIGHTHOUSE_API!,
      `spotify-proofs-${Date.now()}`
    );

    if (response.data) {
      // Store the IPFS hash for later retrieval
      storeIpfsHash(response.data.Hash);
      
      return NextResponse.json({
        success: true,
        hash: response.data.Hash,
        name: response.data.Name,
        size: response.data.Size,
        message: 'Spotify proofs successfully uploaded to IPFS'
      });
    } else {
      throw new Error('Failed to upload to Lighthouse');
    }
    
  } catch (error) {
    console.error('Lighthouse upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload proofs to Lighthouse',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
