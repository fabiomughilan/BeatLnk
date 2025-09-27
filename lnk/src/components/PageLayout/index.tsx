import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

interface PageMainProps {
  children: ReactNode;
  className?: string;
}

function PageMain({ children, className = '' }: PageMainProps) {
  return (
    <main className={`min-h-screen ${className}`}>
      {children}
    </main>
  );
}

export function Page({ children }: PageProps) {
  return <div className="w-full">{children}</div>;
}

Page.Main = PageMain;
