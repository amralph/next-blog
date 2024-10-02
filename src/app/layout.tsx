import type { Metadata } from 'next';
import './globals.css';
import ConfigureAmplifyClientSide from '@/app/amplify-cognito-config';

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
      <body>
        <>
          <ConfigureAmplifyClientSide />
          {children}
        </>
      </body>
    </html>
  );
}
