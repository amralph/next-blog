import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/nav/NavBar';
import { UserProvider as Auth0UserProvider } from '@auth0/nextjs-auth0/client';
import { UserProvider } from '@/context/UserContext';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Next Blog',
  description: 'Creating a blog using Next.js',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Auth0UserProvider>
        <body>
          <Toaster />
          <UserProvider>
            <NavBar></NavBar>
            <div className='p-4'>{children}</div>
          </UserProvider>
        </body>
      </Auth0UserProvider>
    </html>
  );
}
