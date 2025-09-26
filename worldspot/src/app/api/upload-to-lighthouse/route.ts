import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import lighthouse from '@lighthouse-web3/sdk';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proofs, publicKey, signedMessage } = await req.json();

    if (!proofs || !publicKey || !signedMessage) {
      return NextResponse.json({ 
        error: 'Missing required fields: proofs, publicKey, or signedMessage' 
      }, { status: 400 });
    }

    // Convert proofs to JSON string for encryption
    const proofsText = JSON.stringify(proofs, null, 2);
    
    // Upload encrypted data to Lighthouse
    const response = await lighthouse.textUploadEncrypted(
      proofsText,
      process.env.LIGHTHOUSE_API_KEY!,
      publicKey,
      signedMessage,
      `spotify-proofs-${Date.now()}`
    );

    if (response.data) {
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
