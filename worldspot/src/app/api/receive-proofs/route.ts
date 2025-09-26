import { NextRequest, NextResponse } from 'next/server';
import { verifyProof } from '@reclaimprotocol/js-sdk';

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as text (URL-encoded proof object)
    const body = await req.text();
    
    // Decode the URL-encoded proof object
    const decodedBody = decodeURIComponent(body);
    const proof = JSON.parse(decodedBody);

    console.log('Received proof:', proof);

    // Verify the proof using the SDK verifyProof function
    const result = await verifyProof(proof);
    if (!result) {
      console.error('Invalid proof verification');
      return NextResponse.json({ error: 'Invalid proofs data' }, { status: 400 });
    }

    console.log('Proof verification successful:', result);
    
    // Process the proofs here - you can add your business logic
    // For example, store in database, trigger other actions, etc.
    
    return NextResponse.json({ 
      success: true, 
      message: 'Proof verified successfully',
      proofData: proof 
    });
    
  } catch (error) {
    console.error('Error processing proof:', error);
    return NextResponse.json({ 
      error: 'Failed to process proof' 
    }, { status: 500 });
  }
}

