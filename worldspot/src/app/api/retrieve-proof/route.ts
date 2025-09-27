import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ipfsHash = searchParams.get('hash');

    if (!ipfsHash) {
      return NextResponse.json({ 
        error: 'Missing IPFS hash parameter' 
      }, { status: 400 });
    }

    // Fetch data from IPFS using the hash
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    const response = await fetch(ipfsUrl);

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to retrieve data from IPFS',
        details: `HTTP ${response.status}: ${response.statusText}`
      }, { status: 404 });
    }

    const proofData = await response.json();

    // Parse and structure the data
    const structuredData = {
      metadata: {
        ipfsHash,
        retrievedAt: new Date().toISOString(),
        dataSize: JSON.stringify(proofData).length
      },
      spotifyData: {
        likedSongs: proofData.publicData?.liked_songs || [],
        totalSongs: proofData.publicData?.liked_songs?.length || 0
      },
      userInfo: {
        username: JSON.parse(proofData.claimData?.context || '{}').extractedParameters?.username || 'Unknown',
        email: JSON.parse(proofData.claimData?.context || '{}').extractedParameters?.email || 'Not provided'
      },
      verification: {
        provider: proofData.provider || 'Unknown',
        timestamp: proofData.timestamp || 'Unknown',
        signature: proofData.signature ? `${proofData.signature.substring(0, 10)}...` : 'Not available'
      },
      rawData: proofData
    };

    return NextResponse.json({
      success: true,
      data: structuredData
    });

  } catch (error) {
    console.error('Error retrieving proof data:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve proof data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
