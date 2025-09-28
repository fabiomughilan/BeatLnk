'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopArtists from '@/components/TopArtists';

type SelectedArtist = { id: string; name?: string; image?: string };

export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialArtistId = searchParams.get('artistId') || '';

  const [selected, setSelected] = useState<SelectedArtist | null>(
    initialArtistId ? { id: initialArtistId } : null
  );
  const [likedSongsCount, setLikedSongsCount] = useState<number>(0); // User's liked songs count
  const [claiming, setClaiming] = useState<'poster' | 'pass' | 'image1' | 'image2' | null>(null);
  const [claimed, setClaimed] = useState<Record<string, { poster?: boolean; pass?: boolean; image1?: boolean; image2?: boolean }>>({});

  // Derived per-artist claim state
  const claimedForArtist = useMemo(
    () => (selected ? claimed[selected.id] ?? { poster: false, pass: false, image1: false, image2: false } : { poster: false, pass: false, image1: false, image2: false }),
    [claimed, selected]
  );

  // Keep URL in sync with selection
  useEffect(() => {
    if (!selected) return;
    const url = new URL(window.location.href);
    url.searchParams.set('artistId', selected.id);
    window.history.replaceState({}, '', url.toString());
  }, [selected]);

  // Optional: listen for a custom event from TopArtists if it emits one.
  useEffect(() => {
    function onArtistSelected(e: any) {
      // Expecting: new CustomEvent('artist:selected', { detail: { id, name, image } })
      if (e?.detail?.id) setSelected({ id: e.detail.id, name: e.detail.name, image: e.detail.image });
    }
    window.addEventListener('artist:selected', onArtistSelected as EventListener);
    return () => window.removeEventListener('artist:selected', onArtistSelected as EventListener);
  }, []);

  // Handlers
  const handleSelectFromTop = useCallback((artist: SelectedArtist) => {
    setSelected(artist);
  }, []);

  const refreshLikedSongs = useCallback(async () => {
    // TODO: replace with real liked songs fetch from Spotify API
    // e.g., const count = await getLikedSongsCount(userAddress)
    setLikedSongsCount((count) => (count === 0 ? 15 : count)); // demo: 15 liked songs
  }, []);

  const claim = useCallback(
    async (type: 'poster' | 'pass' | 'image1' | 'image2') => {
      if (!selected) return;
      setClaiming(type);
      try {
        // TODO: perform your real claim:
        // 1) Verify entitlement (likes/proof)
        // 2) Anchor/record on chain (if needed)
        // 3) Store payload on Filecoin
        // 4) Update backend status

        // Demo delay
        await new Promise((r) => setTimeout(r, 900));

        setClaimed((prev) => ({
          ...prev,
          [selected.id]: {
            poster: type === 'poster' ? true : prev[selected.id]?.poster,
            pass: type === 'pass' ? true : prev[selected.id]?.pass,
            image1: type === 'image1' ? true : prev[selected.id]?.image1,
            image2: type === 'image2' ? true : prev[selected.id]?.image2,
          },
        }));
      } finally {
        setClaiming(null);
      }
    },
    [selected]
  );

  // Download function for images
  const downloadImage = useCallback((imageName: string, imagePath: string) => {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const canClaim = Boolean(selected);
  const canClaimImages = likedSongsCount > 10; // Requirement: more than 10 liked songs
  const artistTitle = selected?.name ? `${selected.name}` : selected?.id ? `Artist #${selected.id}` : 'Select an artist';

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Professional background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-slate-900/30 to-neutral-950"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-semibold text-center mb-8 text-white">Music Rewards</h1>

        {/* Liked Songs strip */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-6 py-3">
            <span className="text-sm text-gray-300">Liked Songs:</span>
            <span className="font-semibold text-lg text-blue-400">{likedSongsCount}</span>
            <button
              onClick={refreshLikedSongs}
              className="text-sm rounded-md border border-white/15 px-3 py-1 hover:bg-white/5 transition-colors focus-ring"
              title="Refresh liked songs count"
            >
              Refresh
            </button>
          </div>
          {likedSongsCount > 10 && (
            <div className="ml-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
              <span className="text-green-300 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Eligible for digital rewards
              </span>
            </div>
          )}
        </div>

        {/* Artist chooser + details */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Select Artist</h2>
              <p className="text-sm text-gray-300 mt-1">
                Choose an artist to view and claim available rewards.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                placeholder="Artist ID"
                className="rounded-md bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus-ring"
                value={selected?.id ?? ''}
                onChange={(e) => setSelected({ id: e.target.value })}
              />
              <button
                onClick={() => {
                  if (selected?.id) router.push(`?artistId=${encodeURIComponent(selected.id)}`);
                }}
                className="rounded-md bg-blue-600 text-white text-sm px-4 py-2 font-medium hover:bg-blue-700 transition-colors focus-ring"
              >
                Select
              </button>
            </div>
          </div>

          {/* Top artists list with optional onSelect support */}
          <div className="mt-4">
            {/* If your TopArtists supports onSelect, we pass it. If not, the custom event listener above still works. */}
            {/* @ts-expect-error allow optional prop */}
            <TopArtists onSelect={handleSelectFromTop} />
          </div>
        </div>

        {/* Perks for the selected artist */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">{artistTitle}</h2>
            {!selected && <p className="text-sm text-gray-400 mt-1">Select an artist above to view rewards.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Limited-Edition Poster */}
            <div className="bg-black/30 rounded-lg border border-white/10 overflow-hidden">
              <div className="relative">
                <img
                  src={selected?.image || 'https://picsum.photos/seed/poster/900/500'}
                  alt="Limited edition poster"
                  className="w-full h-44 object-cover"
                />
                <span className="absolute top-3 left-3 rounded-md bg-white/10 backdrop-blur px-3 py-1 text-xs">
                  Limited Edition • 1 / 250
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Limited-Edition Poster</h3>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                      claimedForArtist.poster
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-amber-400/15 text-amber-300'
                    }`}
                  >
                    {claimedForArtist.poster ? 'Claimed' : 'Unclaimed'}
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-1">
                  Museum-grade print featuring {selected ? 'this artist' : 'your selected artist'}. One per account.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold text-sm">Free • Requires artist selection</span>
                  <button
                    disabled={!canClaim || claimedForArtist.poster || claiming === 'poster'}
                    onClick={() => claim('poster')}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-ring
                      ${!canClaim || claimedForArtist.poster || claiming === 'poster'
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {claiming === 'poster' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : claimedForArtist.poster ? 'Claimed' : 'Claim Poster'}
                  </button>
                </div>
              </div>
            </div>

            {/* Event Pass */}
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
              <div className="relative">
                <div className="w-full h-44 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20" />
                <span className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs">
                  Next Event • General
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Event Pass</h3>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                      claimedForArtist.pass
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-amber-400/15 text-amber-300'
                    }`}
                  >
                    {claimedForArtist.pass ? 'Claimed' : 'Unclaimed'}
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-1">
                  Valid for next event for {selected ? 'this artist' : 'your selected artist'}. Non-transferable.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold text-sm">Free • Requires artist selection</span>
                  <button
                    disabled={!canClaim || claimedForArtist.pass || claiming === 'pass'}
                    onClick={() => claim('pass')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition
                      ${!canClaim || claimedForArtist.pass || claiming === 'pass'
                        ? 'bg-white/10 opacity-60 cursor-not-allowed'
                        : 'bg-white text-neutral-900 hover:opacity-90'}`}
                  >
                    {claiming === 'pass' ? 'Claiming…' : claimedForArtist.pass ? 'Claimed' : 'Claim Pass'}
                  </button>
                </div>
              </div>
            </div>

            {/* Exclusive Image 1 */}
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden hover-lift transition-all duration-300 hover-glow animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative group">
                <img
                  src="/image1.png"
                  alt="Exclusive Image 1"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs animate-pulse">
                  Exclusive • Digital
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Exclusive Image 1</h3>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                      claimedForArtist.image1
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-amber-400/15 text-amber-300'
                    }`}
                  >
                    {claimedForArtist.image1 ? 'Claimed' : 'Unclaimed'}
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-1">
                  High-resolution digital artwork. Download and use as wallpaper or print.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold text-sm">Free • Requires 10+ liked songs</span>
                  <div className="flex gap-2">
                    {claimedForArtist.image1 ? (
                      <button
                        onClick={() => downloadImage('exclusive-image-1.png', '/image1.png')}
                        className="rounded-md px-3 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors focus-ring"
                      >
                        Download
                      </button>
                    ) : (
                      <button
                        disabled={!canClaim || !canClaimImages || claiming === 'image1'}
                        onClick={() => claim('image1')}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-ring
                          ${!canClaim || !canClaimImages || claiming === 'image1'
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {claiming === 'image1' ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Processing...
                          </span>
                        ) : canClaimImages ? 'Claim Image' : 'Need 10+ songs'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Image 2 */}
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden hover-lift transition-all duration-300 hover-glow animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative group">
                <img
                  src="/image2.png"
                  alt="Exclusive Image 2"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs animate-pulse">
                  Premium • Digital
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Exclusive Image 2</h3>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                      claimedForArtist.image2
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-amber-400/15 text-amber-300'
                    }`}
                  >
                    {claimedForArtist.image2 ? 'Claimed' : 'Unclaimed'}
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-1">
                  Premium digital artwork. Perfect for social media or personal collection.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold text-sm">Free • Requires 10+ liked songs</span>
                  <div className="flex gap-2">
                    {claimedForArtist.image2 ? (
                      <button
                        onClick={() => downloadImage('exclusive-image-2.png', '/image2.png')}
                        className="rounded-full px-3 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover-scale focus-ring"
                      >
                        <span className="flex items-center gap-2">
                          <span>📥</span>
                          Download
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={!canClaim || !canClaimImages || claiming === 'image2'}
                        onClick={() => claim('image2')}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover-scale focus-ring
                          ${!canClaim || !canClaimImages || claiming === 'image2'
                            ? 'bg-white/10 opacity-60 cursor-not-allowed'
                            : 'bg-white text-neutral-900 hover:opacity-90 hover-glow'}`}
                      >
                        {claiming === 'image2' ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                            Claiming…
                          </span>
                        ) : canClaimImages ? 'Claim Image' : 'Need 10+ songs'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements helper */}
          <p className="text-[11px] opacity-60 mt-4">
            All perks are completely free! Digital images require 10+ liked songs, while physical perks (poster, event pass) require artist selection. 
            All perks are tied to your Spotify verification and can be downloaded after claiming.
          </p>
        </div>

        {/* Top Artists Section (kept at bottom for discovery) */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">🎵 Your Top Artists</h2>
          {/* If TopArtists supports onSelect, selection will update instantly.
              Otherwise, it can dispatch the 'artist:selected' CustomEvent that we listen for. */}
          {/* @ts-expect-error optional prop support */}
          <TopArtists onSelect={handleSelectFromTop} />
        </div>
      </div>
    </div>
  );
}