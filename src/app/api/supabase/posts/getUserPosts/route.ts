import { NextRequest, NextResponse } from 'next/server';
import { createClientWithUserSession } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClientWithUserSession();

  const { searchParams } = new URL(req.url);
  const pageSize = parseInt(searchParams.get('pageSize') || '-1') || -1;
  const currentIndex = parseInt(searchParams.get('currentIndex') || '-1') || -1;
  const display_name = searchParams.get('displayName');

  if (pageSize === -1 || currentIndex === -1) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 400, statusText: 'Failed to fetch posts' }
    );
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('content, created_at, image_url, users (display_name)')
        .eq('users.display_name', display_name)
        .order('created_at', { ascending: false })
        .range(currentIndex, currentIndex + pageSize - 1);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch posts' },
          { status: 400, statusText: 'Failed to fetch posts' }
        );
      }
      return NextResponse.json(data, { status: 200, statusText: 'OK' });
    } else {
      console.error('Error fetching posts: No supabase');
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500, statusText: 'Error fetching posts: No supabase' }
      );
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500, statusText: 'Failed to fetch posts' }
    );
  }
}
