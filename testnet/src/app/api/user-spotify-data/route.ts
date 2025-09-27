import { NextRequest, NextResponse } from "next/server";
import { getUserProofs } from "@/utils/ipnsManager";
import { getArtistAnalysis } from "@/utils/artistDataStore";

export async function GET(req: NextRequest) {
  try {
    // Get wallet address from query params
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required. Please provide ?wallet=<address>' 
      }, { status: 400 });
    }


    // Try to fetch user's proofs directly from IPNS first
    let allProofs;
    try {
      allProofs = await getUserProofs(walletAddress);
    } catch (ipnsError) {
      allProofs = null;
    }
    
    // If no IPNS data, try fallback to in-memory store
    if (!allProofs || allProofs.length === 0) {
      const memoryData = getArtistAnalysis();
      
      if (memoryData) {
        // Convert in-memory data to IPNS-like format
        const sortedArtists = Object.entries(memoryData.allArtists)
          .sort(([,a], [,b]) => (b as number) - (a as number));

        const responseData = {
          walletAddress,
          totalVerifications: 1, // Assume 1 verification from memory
          latestVerification: new Date().toISOString(),
          spotifyData: {
            totalSongs: memoryData.totalSongs,
            totalArtists: sortedArtists.length,
            allArtists: memoryData.allArtists,
            top2Artists: sortedArtists.slice(0, 2).map(([name, count]) => ({ name, count })),
            topArtist: memoryData.topArtist
          },
          nftStatus: {
            eligibleArtists: sortedArtists.filter(([, count]) => (count as number) >= 10),
            hasEligibleNFTs: memoryData.nftEligible
          },
          dataSource: {
            source: 'In-Memory (Fallback)',
            ipnsAccess: `Fallback to in-memory storage - IPNS data not found`,
            lastUpdate: new Date().toISOString()
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });
      }
      
      // No data in IPNS or memory
      return NextResponse.json({
        success: false,
        error: 'No Spotify data found. Please verify your account first.',
        data: {
          walletAddress,
          totalSongs: 0,
          totalVerifications: 0,
          message: 'No data in IPNS or in-memory store'
        }
      }, { status: 404 });
    }

    // Get the latest proof (most recent verification)
    const latestProof = allProofs[allProofs.length - 1];
    
    // Extract and analyze Spotify data from IPNS
    const likedSongs = latestProof?.publicData?.liked_songs || [];
    const artistCount: Record<string, number> = {};

    // Count artist occurrences
    for (const item of likedSongs) {
      const artists = item?.track?.artists ?? [];
      for (const artist of artists) {
        const name = artist?.name;
        if (!name) continue;
        artistCount[name] = (artistCount[name] || 0) + 1;
      }
    }

    // Sort artists by song count (descending)
    const sortedArtists = Object.entries(artistCount)
      .sort(([,a], [,b]) => b - a);

    // Get top 2 artists
    const top2Artists = sortedArtists.slice(0, 2);
    const topArtist = sortedArtists[0];

    // Prepare response data
    const responseData = {
      walletAddress,
      totalVerifications: allProofs.length,
      latestVerification: latestProof.addedAt,
      spotifyData: {
        totalSongs: likedSongs.length,
        totalArtists: sortedArtists.length,
        allArtists: artistCount,
        top2Artists: top2Artists.map(([name, count]) => ({ name, count })),
        topArtist: topArtist ? { name: topArtist[0], count: topArtist[1] } : null
      },
      nftStatus: {
        eligibleArtists: sortedArtists.filter(([, count]) => count >= 10),
        hasEligibleNFTs: sortedArtists.some(([, count]) => count >= 10)
      },
      dataSource: {
        source: 'IPNS',
        ipnsAccess: `Fetched from decentralized IPNS storage`,
        lastUpdate: latestProof.addedAt
      }
    };


    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching Spotify data from IPNS:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Spotify data from IPNS',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
