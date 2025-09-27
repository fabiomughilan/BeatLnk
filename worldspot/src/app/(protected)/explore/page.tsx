<<<<<<< HEAD
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
  const [balance, setBalance] = useState<number>(0); // TODO: fetch real VibeCoin balance
  const [claiming, setClaiming] = useState<'poster' | 'pass' | null>(null);
  const [claimed, setClaimed] = useState<Record<string, { poster?: boolean; pass?: boolean }>>({});

  // Derived per-artist claim state
  const claimedForArtist = useMemo(
    () => (selected ? claimed[selected.id] ?? { poster: false, pass: false } : { poster: false, pass: false }),
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

  const refreshBalance = useCallback(async () => {
    // TODO: replace with real balance fetch from World mainnet (VibeCoin)
    // e.g., const b = await getVibeCoinBalance(address)
    setBalance((b) => (b === 0 ? 120 : b)); // simple demo toggle
  }, []);

  const claim = useCallback(
    async (type: 'poster' | 'pass') => {
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
          },
        }));
      } finally {
        setClaiming(null);
      }
    },
    [selected]
  );

  const canClaim = Boolean(selected);
  const artistTitle = selected?.name ? `${selected.name}` : selected?.id ? `Artist #${selected.id}` : 'Select an artist';

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">VibeCoin Rewards</h1>

        {/* Balance strip */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className="text-sm opacity-80">Your Balance:</span>
            <span className="font-bold text-lg">{balance} VibeCoin</span>
            <button
              onClick={refreshBalance}
              className="text-sm rounded-full border border-white/15 px-3 py-1 hover:bg-white/5 transition"
              title="Refresh balance"
            >
              Refresh
            </button>
=======
import ProofRetriever from "@/components/ProofRetriever";
import AutoProofFetcher from "@/components/AutoProofFetcher";
import ProofHistory from "@/components/ProofHistory";
import IPNSDataViewer from "@/components/IPNSDataViewer";

export default function Explore() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Explore Music</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎵 Your Music Dashboard</h2>
              <p className="text-gray-600 mb-4">Discover your top artists and music preferences</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                View Dashboard
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎨 NFT Collection</h2>
              <p className="text-gray-600 mb-4">View your exclusive artist NFTs</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                View NFTs
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">🎤 Music Rooms</h2>
              <p className="text-gray-600 mb-4">Join collaborative music rooms</p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                Explore Rooms
              </button>
            </div>
          </div>

          {/* IPNS Data Viewer Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">🔗 IPNS Data Source</h2>
            <IPNSDataViewer />
          </div>

          {/* Auto Proof Fetcher Section */}
          <AutoProofFetcher />

          {/* Proof History Section */}
          <div className="mt-8">
            <ProofHistory />
          </div>

          {/* Manual Proof Retriever Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-6">Manual Proof Retrieval</h2>
            <ProofRetriever />
>>>>>>> parent of a7acd92 (changes)
          </div>
        </div>

        {/* Artist chooser + details */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Choose an Artist</h2>
              <p className="text-sm opacity-75">
                Select your favorite artist from your list to view and claim eligible perks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Artist ID…"
                className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none"
                value={selected?.id ?? ''}
                onChange={(e) => setSelected({ id: e.target.value })}
              />
              <button
                onClick={() => {
                  if (selected?.id) router.push(`?artistId=${encodeURIComponent(selected.id)}`);
                }}
                className="rounded-lg bg-white text-neutral-900 text-sm px-3 py-2 font-medium hover:opacity-90 transition"
              >
                Set
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
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{artistTitle}</h2>
            {!selected && <p className="text-sm opacity-70 mt-1">Pick an artist above to view perks.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Limited-Edition Poster */}
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
              <div className="relative">
                <img
                  src={selected?.image || 'https://picsum.photos/seed/poster/900/500'}
                  alt="Limited edition poster"
                  className="w-full h-44 object-cover"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs">
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
                  <span className="text-yellow-300 font-semibold text-sm">Cost: 50 VibeCoin</span>
                  <button
                    disabled={!canClaim || claimedForArtist.poster || claiming === 'poster' || balance < 50}
                    onClick={() => claim('poster')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition
                      ${!canClaim || claimedForArtist.poster || claiming === 'poster' || balance < 50
                        ? 'bg-white/10 opacity-60 cursor-not-allowed'
                        : 'bg-white text-neutral-900 hover:opacity-90'}`}
                  >
                    {claiming === 'poster' ? 'Claiming…' : claimedForArtist.poster ? 'Claimed' : 'Claim Poster'}
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
                  <span className="text-yellow-300 font-semibold text-sm">Cost: 25 VibeCoin</span>
                  <button
                    disabled={!canClaim || claimedForArtist.pass || claiming === 'pass' || balance < 25}
                    onClick={() => claim('pass')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition
                      ${!canClaim || claimedForArtist.pass || claiming === 'pass' || balance < 25
                        ? 'bg-white/10 opacity-60 cursor-not-allowed'
                        : 'bg-white text-neutral-900 hover:opacity-90'}`}
                  >
                    {claiming === 'pass' ? 'Claiming…' : claimedForArtist.pass ? 'Claimed' : 'Claim Pass'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Balance helper */}
          <p className="text-[11px] opacity-60 mt-4">
            Perks are tied to your VibeCoin proof on World mainnet. Costs are deducted on claim. Balance and eligibility checks should be verified on-chain and stored to Filecoin.
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