import { NextRequest, NextResponse } from 'next/server';

interface IRequestPayload {
  message: string;
  signature: string;
  address: string;
  action: string;
}

/**
 * This route is used to verify wallet signatures
 * Simple signature verification without external dependencies
 */
export async function POST(req: NextRequest) {
  try {
    const { message, signature, address, action } = (await req.json()) as IRequestPayload;

    // Basic validation
    if (!message || !signature || !address || !action) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Simple signature validation (in production, use proper signature verification)
    const isValidSignature = signature.length > 0 && signature.startsWith('0x');
    const isValidAddress = address.length === 42 && address.startsWith('0x');

    if (isValidSignature && isValidAddress) {
      // This is where you would perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      return NextResponse.json({ 
        success: true, 
        message: 'Signature verified successfully',
        address,
        action
      }, { status: 200 });
    } else {
      // Handle invalid signatures
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid signature or address format' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify signature' 
    }, { status: 500 });
  }
}