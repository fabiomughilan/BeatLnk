import { NextRequest, NextResponse } from "next/server";
import { verifyProof } from "@reclaimprotocol/js-sdk";
import util from "node:util";
import { storeArtistAnalysis } from "@/utils/artistDataStore";
import { updateUserProofs, getLatestUserProof } from "@/utils/ipnsManager";
// import { auth } from "@/auth";

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
    
    // Store proof in IPNS
    const ipnsResult = await updateUserProofs(walletAddress, enhancedProof);

    return NextResponse.json({
      success: true,
      message: "Proof verified successfully",
      artistAnalysis,
      proofData: enhancedProof,
      ipnsId: ipnsResult.ipnsId,
      gatewayUrl: ipnsResult.gatewayUrl,
      walletAddress,
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