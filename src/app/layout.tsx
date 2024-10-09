import type { Metadata } from 'next';
import './globals.css';

import { NavBar } from '@/components/nav/NavBar';
import { UserProvider } from '@auth0/nextjs-auth0/client';
export const metadata: Metadata = {
  title: 'Next Blog',
  description: 'Creating a blog using Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <UserProvider>
        <body>
          <NavBar></NavBar>

          {children}
        </body>
      </UserProvider>
    </html>
  );
}
