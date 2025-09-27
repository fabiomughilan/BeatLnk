import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProofs } from "@/utils/ipnsManager";
import { getArtistAnalysis, getIpfsHash } from "@/utils/artistDataStore";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const walletAddress = session.user?.walletAddress || 
                         session.user?.id || 
                         'unknown';

    // Check all data sources
    const memoryData = getArtistAnalysis();
    const ipfsHash = getIpfsHash();
    
    let ipnsData = null;
    try {
      ipnsData = await getUserProofs(walletAddress);
    } catch (error) {
      console.log("IPNS error:", error);
    }

    return NextResponse.json({
      debug: {
        session: {
          user: session.user,
          walletAddress,
        },
        dataSources: {
          inMemory: {
            available: !!memoryData,
            data: memoryData
          },
          ipfsHash: {
            available: !!ipfsHash,
            hash: ipfsHash
          },
          ipns: {
            available: !!ipnsData && ipnsData.length > 0,
            count: ipnsData?.length || 0,
            data: ipnsData
          }
        }
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
