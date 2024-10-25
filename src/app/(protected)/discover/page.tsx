import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { PostForm } from './PostForm';
import { createClientWithUserSession } from '@/lib/supabase/server';
import { Post } from '@/components/post/Post';
import { imageCacheBuster } from '@/lib/utils/imageCacheBuster';

const DiscoverPage = async () => {
  const supabase = await createClientWithUserSession();

  let posts: {
    content: string;
    created_at: string;
    image_url: string;
    users: { display_name: string; profile_image_url: string } | any;
  }[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('posts')
      .select(
        'content, created_at, image_url, users (display_name, profile_image_url)'
      )
      .order('created_at', { ascending: false });

    if (data) {
      posts = data;
    }
  }

  return (
    <div className='space-y-4'>
      <div className=''>
        <PostForm></PostForm>
      </div>
      <div>
        <div className='space-y-2'>
          {posts.map((post, index) => (
            <div key={index}>
              <Post
                post={post}
                userData={{
                  display_name: post.users.display_name,
                  profile_image_url: imageCacheBuster(
                    post.users.profile_image_url
                  ),
                }}
              ></Post>
            </div>
          ))}
        </div>
        <div>
          {/* client side component specifically for loading tweets in the client*/}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
