import { PostForm } from './PostForm';
import { createClientWithUserSession } from '@/lib/supabase/server';
import { Post } from '@/components/post/Post';
import { imageCacheBuster } from '@/lib/utils/imageCacheBuster';
import { ClientPosts } from './ClientPosts';
import { pageSize } from '@/lib/utils/constants';

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
      .order('created_at', { ascending: false })
      .range(0, pageSize - 1);

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
          <ClientPosts pageSize={pageSize} />
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
