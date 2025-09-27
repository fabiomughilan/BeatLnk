'use client';

import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center text-center min-h-[70dvh]">
        {/* Animated title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 bg-clip-text text-transparent"
        >
          BeatLink
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="opacity-80 max-w-xl mb-8 text-base md:text-lg"
        >
          Discover music, verify your vibes with <span className="font-semibold">VibeCoin</span>,
          and unlock exclusive artist communities.
        </motion.p>

        {/* Auth Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <AuthButton />
        </motion.div>

        {/* Floating feature cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { title: 'Discover', desc: 'Fresh drops & trending beats.' },
            { title: 'Collect', desc: 'Own vibes & earn perks.' },
            { title: 'Community', desc: 'Join token-gated artist chats.' },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 hover:scale-[1.02] transition-transform"
            >
              <div className="font-medium text-sm">{c.title}</div>
              <div className="text-xs opacity-70">{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </Page.Main>
    </Page>
  );
}