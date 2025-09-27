'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, User, Compass, Coins } from 'iconoir-react';
import { useRouter, usePathname } from 'next/navigation';

type NavigationProps = {
  walletBadge?: string | number; // e.g., '120' or 120
};

export const Navigation = ({ walletBadge }: NavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const current = useMemo(() => {
    if (pathname?.startsWith('/explore')) return 'explore';
    if (pathname?.startsWith('/wallet')) return 'wallet';
    if (pathname?.startsWith('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  // Prefetch common targets for a snappier UX
  useEffect(() => {
    router.prefetch?.('/home');
    router.prefetch?.('/explore');
    router.prefetch?.('/wallet');
    router.prefetch?.('/profile');
  }, [router]);

  const handleTabChange = useCallback(
    (value: string) => {
      if (value === current) return; // avoid redundant pushes
      if (navigator?.vibrate) navigator.vibrate(10); // light tap (no-op on most desktops)
      switch (value) {
        case 'home':
          router.push('/home');
          break;
        case 'explore':
          router.push('/explore');
          break;
        case 'wallet':
          router.push('/wallet');
          break;
        case 'profile':
          router.push('/profile');
          break;
      }
    },
    [current, router]
  );

  return (
    <div
      className="
        fixed bottom-0 inset-x-0 z-50
        border-t border-white/10
        bg-white/80 backdrop-blur-md
        dark:bg-black/60
        supports-[backdrop-filter]:bg-white/40
        px-3
        pb-[max(env(safe-area-inset-bottom),12px)]
        pt-2
      "
      role="navigation"
      aria-label="Primary"
    >
      <Tabs
        value={current}
        onValueChange={handleTabChange}
        className="mx-auto max-w-xl"
      >
        <NavItem value="home" label="Home" active={current === 'home'}>
          <Home strokeWidth={2} />
        </NavItem>

        <NavItem value="explore" label="Explore" active={current === 'explore'}>
          <Compass strokeWidth={2} />
        </NavItem>

        <NavItem
          value="wallet"
          label="Vibe Coins"
          active={current === 'wallet'}
          badge={walletBadge}
        >
          <Coins strokeWidth={2} />
        </NavItem>

        <NavItem value="profile" label="Profile" active={current === 'profile'}>
          <User strokeWidth={2} />
        </NavItem>
      </Tabs>
    </div>
  );
};

/** Mini wrapper to add active pill + badge */
function NavItem({
  value,
  label,
  active,
  children,
  badge,
}: {
  value: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
  badge?: string | number;
}) {
  return (
    <TabItem
      value={value}
      label={label}
      icon={
        <div className="relative">
          <div
            className={`
              relative grid place-items-center h-10 w-10 rounded-full
              transition-all
              ${active
                ? 'bg-black/5 dark:bg-white/10 shadow-[0_0_18px_rgba(56,189,248,0.35)]'
                : 'bg-transparent'}
            `}
            aria-hidden
          >
            {children}
            {active && (
              <span
                className="
                  pointer-events-none absolute inset-0 rounded-full
                  ring-1 ring-cyan-400/40
                  motion-reduce:hidden
                  animate-[pulse_2s_ease-in-out_infinite]
                "
              />
            )}
          </div>
          {badge !== undefined && badge !== null && badge !== '' && (
            <span
              className="
                absolute -top-1 -right-1 text-[10px] leading-[14px] px-1.5 rounded-full
                bg-amber-500 text-white
              "
              aria-label={`${badge} ${label}`}
            >
              {String(badge)}
            </span>
          )}
        </div>
      }
      aria-current={active ? 'page' : undefined}
    />
  );
}