import { NextRequest, NextResponse } from "next/server";
import { getArtistAnalysis } from "@/utils/artistDataStore";

<<<<<<< HEAD
export async function GET(req: NextRequest) {
=======
export async function GET(_req: NextRequest) {
>>>>>>> parent of 68c4cd4 (vercel1)
  try {
    const artistAnalysis = getArtistAnalysis();
    
    if (!artistAnalysis) {
      return NextResponse.json({ 
        error: "No artist analysis available. Please verify your Spotify account first." 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      artistAnalysis
    });
  } catch (error) {
    console.error("Error retrieving artist analysis:", error);
    return NextResponse.json(
      { error: "Failed to retrieve artist analysis" },
      { status: 500 }
    );
  }
}