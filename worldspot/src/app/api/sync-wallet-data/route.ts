import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserProofs } from "@/utils/ipnsManager";
import { getArtistAnalysis } from "@/utils/artistDataStore";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const walletAddress = session.user?.walletAddress || session.user?.id;
    
    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'No wallet address found in session' 
      }, { status: 400 });
    }

    // Get current in-memory artist analysis
    const artistAnalysis = getArtistAnalysis();
    
    if (!artistAnalysis) {
      return NextResponse.json({ 
        error: 'No artist analysis data found. Please verify your Spotify account first.' 
      }, { status: 404 });
    }

    // Create a mock proof object from the artist analysis
    // This allows us to store the existing analysis data in IPNS
    const mockProof = {
      provider: "spotify",
      timestamp: Date.now(),
      publicData: {
        // Reconstruct liked_songs from artist data
        liked_songs: Object.entries(artistAnalysis.allArtists).flatMap(([artistName, count]) => 
          Array(count).fill(null).map((_, index) => ({
            track: {
              name: `Song ${index + 1}`,
              artists: [{ name: artistName }],
              album: { name: "Unknown Album" }
            },
            added_at: new Date().toISOString()
          }))
        )
      },
      claimData: {
        context: JSON.stringify({
          extractedParameters: {
            walletAddress: walletAddress,
            syncedAt: new Date().toISOString()
          }
        })
      },
      signature: "synced_data"
    };

    // Store in IPNS under the correct wallet address
    const ipnsResult = await updateUserProofs(walletAddress, mockProof);

    console.log(`🔄 Synced artist data to IPNS for wallet: ${walletAddress}`);
    console.log(`   Artists: ${Object.keys(artistAnalysis.allArtists).length}`);
    console.log(`   Total Songs: ${artistAnalysis.totalSongs}`);
    console.log(`   IPNS ID: ${ipnsResult.ipnsId}`);

    return NextResponse.json({
      success: true,
      message: "Artist data synced to IPNS successfully",
      walletAddress,
      artistAnalysis,
      ipnsId: ipnsResult.ipnsId,
      gatewayUrl: ipnsResult.gatewayUrl
    });

  } catch (error) {
    console.error('Error syncing wallet data:', error);
    return NextResponse.json({ 
      error: 'Failed to sync wallet data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
