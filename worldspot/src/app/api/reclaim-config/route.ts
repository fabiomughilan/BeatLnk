import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reclaimProofRequestConfig = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'spotify',
      userId: session.user.walletAddress,
      timestamp: Date.now(),
      config: {
        redirectUrl: `${process.env.NEXTAUTH_URL}/reclaim-callback`,
        scopes: ['user-read-private', 'user-read-email', 'user-top-read'],
        claims: [
          {
            provider: 'spotify',
            params: {
              username: 'required',
              email: 'required',
              topTracks: 'optional',
              topArtists: 'optional'
            }
          }
        ]
      },
    };

    console.log('Generated config:', reclaimProofRequestConfig);
    const jsonString = JSON.stringify(reclaimProofRequestConfig);
    console.log('JSON string:', jsonString);

    return NextResponse.json({ 
      reclaimProofRequestConfig: jsonString
    });
    
  } catch (error) {
    console.error('Reclaim config generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate Reclaim config' 
    }, { status: 500 });
  }
}