import { NextRequest, NextResponse } from "next/server";
import { verifyProof } from "@reclaimprotocol/js-sdk";
import util from "node:util";

export async function POST(req: NextRequest) {
  try {
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
      } : null,
      allArtists: artistCount,
      totalSongs: liked.length,
      nftEligible: topArtist ? topArtist[1] >= 10 : false
    };

    return NextResponse.json({
      success: true,
      message: "Proof verified successfully",
      artistAnalysis,
      proofData: proof,
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