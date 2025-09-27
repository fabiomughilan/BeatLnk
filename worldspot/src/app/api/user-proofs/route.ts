import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProofs, getLatestUserProof } from "@/utils/ipnsManager";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user?.id || 'default';

    // Get all proofs for the user
    const allProofs = await getUserProofs(userId);
    const latestProof = await getLatestUserProof(userId);

    // Analyze the latest proof for dashboard data
    let latestAnalysis = null;
    if (latestProof) {
      const liked = latestProof?.publicData?.liked_songs ?? [];
      const artistCount: Record<string, number> = {};

      for (const item of liked) {
        const artists = item?.track?.artists ?? [];
        for (const artist of artists) {
          const name = artist?.name;
          if (!name) continue;
          artistCount[name] = (artistCount[name] || 0) + 1;
        }
      }

      const topArtist = Object.entries(artistCount)
        .sort(([,a], [,b]) => b - a)[0];

      latestAnalysis = {
        topArtist: topArtist ? {
          name: topArtist[0],
          count: topArtist[1]
        } : null,
        allArtists: artistCount,
        totalSongs: liked.length,
        nftEligible: topArtist ? topArtist[1] >= 10 : false
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        totalProofs: allProofs.length,
        latestProof,
        latestAnalysis,
        allProofs: allProofs.map(proof => ({
          proofId: proof.proofId,
          addedAt: proof.addedAt,
          totalSongs: proof.publicData?.liked_songs?.length || 0,
          timestamp: proof.timestamp
        }))
      }
    });

  } catch (error) {
    console.error('Error retrieving user proofs:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve user proofs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
