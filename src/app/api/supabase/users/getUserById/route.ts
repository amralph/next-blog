import { NextRequest, NextResponse } from 'next/server';
import { createClientWithUserSession } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClientWithUserSession();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');

  try {
    // Query the users table to find a user by id

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*') // don't get all data here...
        .eq('auth0_id', userId)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch user' },
          { status: 400, statusText: 'Failed to fetch user' }
        );
      }
      return NextResponse.json(data, { status: 200, statusText: 'OK' });
    } else {
      console.error('Error fetching user by email: No supabase');
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500, statusText: 'Error fetching user by email: No supabase' }
      );
    }
  } catch (err) {
    console.error('Error fetching user by email:', err);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500, statusText: 'Failed to fetch user' }
    );
  }
}
