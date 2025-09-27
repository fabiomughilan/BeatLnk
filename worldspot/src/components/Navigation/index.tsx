'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, User, Compass, Coins } from 'iconoir-react';
import { useRouter, usePathname } from 'next/navigation';

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = () => {
    if (pathname.includes('/home')) return 'home';
    if (pathname.includes('/explore')) return 'explore';
    if (pathname.includes('/wallet')) return 'wallet';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  };

  const handleTabChange = (value: string) => {
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
  };

  return (
    <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="explore" icon={<Compass />} label="Explore" />
      <TabItem value="wallet" icon={<Coins />} label="Vibe Coins" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};