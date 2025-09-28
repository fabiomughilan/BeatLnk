'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { Home, User, Compass, ChatBubble, Settings } from 'iconoir-react';
import { useRouter, usePathname } from 'next/navigation';

type NavigationProps = {
  walletBadge?: string | number; // e.g., '120' or 120
};

export const Navigation = ({ walletBadge }: NavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const current = useMemo(() => {
    if (pathname?.startsWith('/explore')) return 'explore';
    if (pathname?.startsWith('/chat')) return 'chat';
    if (pathname?.startsWith('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  // Prefetch common targets for a snappier UX
  useEffect(() => {
    router.prefetch?.('/home');
    router.prefetch?.('/explore');
    router.prefetch?.('/chat');
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
        case 'chat':
          router.push('/chat');
          break;
        case 'profile':
          router.push('/profile');
          break;
      }
    },
    [current, router]
  );

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home, path: '/home' },
    { id: 'explore', label: 'Rewards', icon: Compass, path: '/explore' },
    { id: 'chat', label: 'Community', icon: ChatBubble, path: '/chat' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav
      className="
        fixed top-0 inset-x-0 z-[100]
        bg-black/90 backdrop-blur-xl
        border-b border-white/10
        px-4 py-2
        pt-[max(env(safe-area-inset-top),16px)]
      "
      role="navigation"
      aria-label="Primary navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center
                px-3 py-2 rounded-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                ${isActive 
                  ? 'bg-blue-600/20 text-blue-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                isActive ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
