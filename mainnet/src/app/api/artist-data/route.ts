import { NextRequest, NextResponse } from "next/server";
import { getArtistAnalysis } from "@/utils/artistDataStore";

export async function GET() {
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