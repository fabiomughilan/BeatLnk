import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getArtistAnalysis } from "@/utils/artistDataStore";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the latest stored artist analysis (which contains the proof data)
    const artistAnalysis = getArtistAnalysis();
    
    if (!artistAnalysis) {
      return NextResponse.json({ 
        error: 'No proof data available. Please verify your Spotify account first.' 
      }, { status: 404 });
    }

    // Return the latest proof data
    return NextResponse.json({
      success: true,
      data: {
        metadata: {
          retrievedAt: new Date().toISOString(),
          source: 'Latest stored proof data'
        },
        spotifyData: {
          totalSongs: artistAnalysis.totalSongs,
          topArtists: artistAnalysis.allArtists
        },
        analysis: {
          topArtist: artistAnalysis.topArtist,
          nftEligible: artistAnalysis.nftEligible
        }
      }
    });

  } catch (error) {
    console.error('Error retrieving latest proof:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve latest proof data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
