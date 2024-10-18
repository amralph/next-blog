import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  if (!session) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  // redirect user to /onboard if user does not have a displayName

  return res;
}

export const config = {
  matcher: ['/home', '/settings'],
};
