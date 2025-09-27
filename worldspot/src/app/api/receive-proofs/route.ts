import { NextRequest, NextResponse } from "next/server";
import { verifyProof } from "@reclaimprotocol/js-sdk";
import util from "node:util";
import { storeArtistAnalysis } from "@/utils/artistDataStore";
import { updateUserProofs, getLatestUserProof } from "@/utils/ipnsManager";
<<<<<<< HEAD
// import { auth } from "@/auth";
=======
import { auth } from "@/auth";
import { compareProofs, prepareMintTransaction, generateMintReason } from "@/utils/vibeCoinMinter";
>>>>>>> parent of a7acd92 (changes)

export async function POST(req: NextRequest) {
  try {
    // Get wallet address from query parameters (passed from generate-config)
    const { searchParams } = new URL(req.url);
    const queryWallet = searchParams.get('wallet');

    // Get the raw body as text (URL-encoded proof object)
    const body = await req.text();

    // Decode the URL-encoded proof object
    const decodedBody = decodeURIComponent(body);
    const proof = JSON.parse(decodedBody);

    console.log(
      "Received proof (expanded):\n",
      util.inspect(proof, { depth: null, maxArrayLength: null, colors: true })
    );

    // Verify the proof using the SDK verifyProof function
    const result = await verifyProof(proof);
    if (!result) {
      console.error("Invalid proof verification");
      return NextResponse.json(
        { error: "Invalid proofs data" },
        { status: 400 }
      );
    }

    console.log("Proof verification successful:", result);

    // Extract liked songs safely
    const liked = proof?.publicData?.liked_songs ?? [];

    // Count artist occurrences
    const artistCount: Record<string, number> = {};

    for (const item of liked) {
      const artists = item?.track?.artists ?? [];
      for (const artist of artists) {
        const name = artist?.name;
        if (!name) continue;
        artistCount[name] = (artistCount[name] || 0) + 1;
      }
    }

    // Log result nicely
    console.log("🎶 Artist counts from liked_songs:");
    Object.entries(artistCount).forEach(([artist, count]) => {
      console.log(`${artist}: ${count} song(s)`);
    });

    // Find top artist
    const topArtist = Object.entries(artistCount)
      .sort(([,a], [,b]) => b - a)[0];

    const artistAnalysis = {
      topArtist: topArtist ? {
        name: topArtist[0],
        count: topArtist[1]
      } : { name: 'No artist', count: 0 },
      allArtists: artistCount,
      totalSongs: liked.length,
      nftEligible: topArtist ? topArtist[1] >= 10 : false
    };

    // Store the analysis data for the dashboard to use
    storeArtistAnalysis(artistAnalysis);

    // Store proof for persistent storage and history
    // Use wallet address from query parameter (most reliable)
    const walletAddress = queryWallet || `wallet_${Date.now()}`;
    
    
    // Add wallet address to proof context for IPNS lookup
    const enhancedProof = {
      ...proof,
      claimData: {
        ...proof.claimData,
        context: JSON.stringify({
          ...JSON.parse(proof.claimData?.context || '{}'),
          extractedParameters: {
            ...JSON.parse(proof.claimData?.context || '{}').extractedParameters,
            walletAddress: walletAddress,
            storedAt: new Date().toISOString()
          }
        })
      }
    };
    
    
    // Get previous proof for comparison (currently unused but kept for future features)
    await getLatestUserProof(walletAddress);
    
    // Compare current proof with previous one
    const comparison = await compareProofs(enhancedProof, previousProof);
    
    console.log(`🔍 Proof comparison for ${walletAddress}:`);
    console.log(`   Is new user: ${comparison.isNewUser}`);
    console.log(`   Has changes: ${comparison.hasChanges}`);
    console.log(`   Should mint: ${comparison.shouldMint}`);
    if (comparison.changes.length > 0) {
      console.log(`   Changes: ${comparison.changes.join(', ')}`);
    }
    
    // Store proof in IPNS
    const ipnsResult = await updateUserProofs(walletAddress, enhancedProof);
    
    // Prepare VibeCoin mint transaction if there are changes
    let mintTransaction = null;
    if (comparison.shouldMint) {
      const mintReason = generateMintReason(comparison);
      try {
        mintTransaction = prepareMintTransaction(walletAddress);
        console.log(`✅ VibeCoin mint transaction prepared for ${walletAddress}`);
      } catch (mintError) {
        console.error(`❌ Failed to prepare mint transaction:`, mintError);
      }
    } else {
      console.log(`⏭️ No changes detected - skipping VibeCoin mint for ${walletAddress}`);
    }

    return NextResponse.json({
      success: true,
      message: "Proof verified successfully",
      artistAnalysis,
      proofData: enhancedProof,
      ipnsId: ipnsResult.ipnsId,
      gatewayUrl: ipnsResult.gatewayUrl,
      walletAddress,
      vibeCoin: {
        shouldMint: comparison.shouldMint,
        mintTransaction: mintTransaction,
        reason: comparison.shouldMint ? generateMintReason(comparison) : 'No changes detected',
        changes: comparison.changes
      }
    });
  } catch (error) {
    console.error("Error processing proof:", error);
    return NextResponse.json(
      {
        error: "Failed to process proof",
      },
      { status: 500 }
    );
  }
}