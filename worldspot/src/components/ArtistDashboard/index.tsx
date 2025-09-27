'use client';
import { useState, useEffect } from 'react';

interface ArtistData {
    name: string;
    count: number;
}

interface ArtistAnalysis {
    topArtist: ArtistData | null;
    allArtists: Record<string, number>;
    totalSongs: number;
    nftEligible: boolean;
}

export default function ArtistDashboard() {
    const [artistAnalysis, setArtistAnalysis] = useState<ArtistAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchArtistAnalysis = async () => {
        try {
            setLoading(true);
            // This would typically fetch from your API endpoint
            // For now, we'll simulate the data structure
            const mockData: ArtistAnalysis = {
                topArtist: {
                    name: "A.R. Rahman",
                    count: 4
                },
                allArtists: {
                    "A.R. Rahman": 4,
                    "Dua Lipa": 2,
                    "Selena Gomez": 2,
                    "Anirudh Ravichander": 2,
                    "Chinmayi": 2
                },
                totalSongs: 8,
                nftEligible: false
            };
            setArtistAnalysis(mockData);
        } catch (error) {
            console.error('Error fetching artist analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtistAnalysis();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading your music analysis...</span>
            </div>
        );
    }

    if (!artistAnalysis) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-600">No music data available. Please verify your Spotify account first.</p>
            </div>
        );
    }

    const sortedArtists = Object.entries(artistAnalysis.allArtists)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-2">🎵 Your Music Dashboard</h1>
                <p className="text-purple-100">
                    Discover your top artists and unlock exclusive NFTs based on your music taste!
                </p>
            </div>

            {/* Top Artist Card */}
            {artistAnalysis.topArtist && (
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Your Top Artist</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold text-blue-600">{artistAnalysis.topArtist.name}</h3>
                            <p className="text-gray-600 text-lg">
                                {artistAnalysis.topArtist.count} song{artistAnalysis.topArtist.count !== 1 ? 's' : ''} in your library
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${artistAnalysis.nftEligible
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {artistAnalysis.nftEligible ? '🎉 NFT Eligible!' : 'Need 10+ songs for NFT'}
                            </div>
                            {!artistAnalysis.nftEligible && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {10 - artistAnalysis.topArtist.count} more songs needed
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* All Artists List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🎶 All Your Artists</h2>
                <div className="space-y-3">
                    {sortedArtists.map(([artist, count]) => (
                        <div key={artist} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-800">{artist}</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">{count} song{count !== 1 ? 's' : ''}</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(count / (artistAnalysis.topArtist?.count || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{artistAnalysis.totalSongs}</div>
                    <div className="text-gray-600">Total Songs</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{sortedArtists.length}</div>
                    <div className="text-gray-600">Unique Artists</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {artistAnalysis.nftEligible ? '1' : '0'}
                    </div>
                    <div className="text-gray-600">NFTs Available</div>
                </div>
            </div>

            {/* NFT Information */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">🎨 NFT Collection</h3>
                <p className="text-yellow-100">
                    When you have 10+ songs from the same artist, you'll automatically receive a custom NFT
                    featuring that artist! Keep listening to unlock exclusive digital collectibles.
                </p>
            </div>
        </div>
    );
}