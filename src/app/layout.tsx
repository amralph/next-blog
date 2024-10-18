import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@auth0/nextjs-auth0';
import { NavBar } from '@/components/nav/NavBar';

export const metadata: Metadata = {
  title: 'Next Blog',
  description: 'Creating a blog using Next.js',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await getSession();

  let userData = null;

  if (userSession) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/getUserById?userId=${userSession.user.sub}`
      );
      userData = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  // looks like i'm going to be using userData in a lot of parts of the application.
  // we might need to create a provider for this...

  return (
    <html lang='en'>
      <body>
        <NavBar userData={userData}></NavBar>
        <div className='p-4'>{children}</div>
      </body>
    </html>
  );
}
