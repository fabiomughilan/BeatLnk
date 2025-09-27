import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { compareProofs, prepareMintTransaction, generateMintReason } from "@/utils/vibeCoinMinter";
import { getLatestUserProof } from "@/utils/ipnsManager";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proofs } = await req.json();
    
    if (!proofs) {
      return NextResponse.json({ 
        error: 'Proofs data is required' 
      }, { status: 400 });
    }

    // Extract wallet address from session
    const walletAddress = session.user?.walletAddress || session.user?.id || 'unknown';
    
    console.log(`🔍 Processing VibeCoin eligibility for ${walletAddress}`);
    
    // Get previous proof for comparison
    const previousProof = await getLatestUserProof(walletAddress);
    
    // Compare current proof with previous one
    const comparison = await compareProofs(proofs, previousProof);
    
    console.log(`🔍 VibeCoin comparison result:`);
    console.log(`   Is new user: ${comparison.isNewUser}`);
    console.log(`   Has changes: ${comparison.hasChanges}`);
    console.log(`   Should mint: ${comparison.shouldMint}`);
    if (comparison.changes.length > 0) {
      console.log(`   Changes: ${comparison.changes.join(', ')}`);
    }
    
    // Prepare VibeCoin mint transaction if there are changes
    let mintTransaction = null;
    if (comparison.shouldMint) {
      const mintReason = generateMintReason(comparison);
      try {
        mintTransaction = prepareMintTransaction(walletAddress);
        console.log(`✅ VibeCoin mint transaction prepared for ${walletAddress}`);
      } catch (mintError) {
        console.error(`❌ Failed to prepare mint transaction:`, mintError);
        return NextResponse.json({ 
          error: 'Failed to prepare mint transaction',
          details: mintError instanceof Error ? mintError.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      console.log(`⏭️ No changes detected - skipping VibeCoin mint for ${walletAddress}`);
    }

    return NextResponse.json({
      success: true,
      vibeCoin: {
        shouldMint: comparison.shouldMint,
        mintTransaction: mintTransaction,
        reason: comparison.shouldMint ? generateMintReason(comparison) : 'No changes detected',
        changes: comparison.changes
      },
      walletAddress
    });

  } catch (error) {
    console.error('Error processing VibeCoin eligibility:', error);
    return NextResponse.json({ 
      error: 'Failed to process VibeCoin eligibility',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
