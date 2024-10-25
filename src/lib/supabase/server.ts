import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';
import jwt from 'jsonwebtoken';

export async function createClientWithUserSession() {
  const cookieStore = cookies();
  const userSession = await getSession(); // only access supabase on the server if there's a userSession

  if (userSession) {
    const signedJwt = jwt.sign(
      {
        sub: userSession.user.sub,
        role: 'authenticated',
      },
      process.env.SUPABASE_JWT_SECRET as string
    );

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
        global: {
          headers: {
            Authorization: `Bearer ${signedJwt}`, // Set the Authorization header with the created JWT
          },
        },
      }
    );
  } else {
    return null;
  }
}
