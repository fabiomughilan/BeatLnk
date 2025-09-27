import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prepareMintTransaction } from "@/utils/vibeCoinMinter";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { walletAddress, reason } = await req.json();
    
    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required' 
      }, { status: 400 });
    }

    console.log(`🪙 Preparing VibeCoin mint for ${walletAddress} - Reason: ${reason}`);
    
    // Prepare the mint transaction data
    const mintTx = prepareMintTransaction(walletAddress);
    
    console.log(`📝 Mint transaction prepared:`, {
      to: mintTx.to,
      value: mintTx.value,
      data: mintTx.data.slice(0, 20) + '...' // Log first 20 chars of data
    });

    return NextResponse.json({
      success: true,
      transaction: mintTx,
      message: `Ready to mint 10 VibeCoin to ${walletAddress}`,
      reason: reason
    });

  } catch (error) {
    console.error('Error preparing VibeCoin mint:', error);
    return NextResponse.json({ 
      error: 'Failed to prepare VibeCoin mint',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
