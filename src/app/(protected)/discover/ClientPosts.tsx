'use client';

import { Post } from '@/components/post/Post';
import { imageCacheBuster } from '@/lib/utils/imageCacheBuster';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface User {
  display_name: string;
  profile_image_url: string;
}

interface Post {
  content: string;
  created_at: string;
  image_url: string;
  users: User;
}

type Posts = Post[];

export const ClientPosts: React.FC<{ pageSize: number }> = ({ pageSize }) => {
  const [currentIndex, setCurrentIndex] = useState(pageSize);

  const [posts, setPosts] = useState<Posts>([]);

  async function loadMore() {
    setCurrentIndex(currentIndex + pageSize);

    const res = await fetch(
      `/api/supabase/posts/getDiscoverPosts?pageSize=${pageSize}&currentIndex=${currentIndex}`
    );

    const newPosts = await res.json();

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  }

  return (
    <div className='space-y-4'>
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
      <Button onClick={loadMore}>Load more</Button>
    </div>
  );
};
