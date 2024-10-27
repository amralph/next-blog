import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar } from '@/components/avatar/Avatar';
import { Post } from '@/components/post/Post';
import { imageCacheBuster } from '@/lib/utils/imageCacheBuster';
import { createClientWithUserSession } from '@/lib/supabase/server';
import { pageSize } from '@/lib/utils/constants';
import { ClientPosts } from './ClientPosts';

const UserPage = async ({ params }: { params: { user: string } }) => {
  const userSession = await getSession();
  let userData = {
    bio: '',
    birthday: '',
    profile_image_url: '',
  };
  let posts: { content: string; created_at: string; image_url: string }[] = [];
  if (userSession) {
    const supabase = await createClientWithUserSession();

    if (supabase) {
      const [supaUserResponse, supaPostsResponse] = await Promise.all([
        supabase
          .from('users')
          .select('bio, birthday, profile_image_url')
          .eq('display_name', params.user)
          .single(),

        supabase
          .from('posts')
          .select(
            'content, created_at, image_url, users (display_name, profile_image_url)'
          )
          .order('created_at', { ascending: false })
          .range(0, pageSize - 1),
      ]);

      if (supaPostsResponse.data) {
        posts = supaPostsResponse.data;
      }

      if (supaUserResponse.data) {
        userData = {
          bio: supaUserResponse.data.bio,
          birthday: supaUserResponse.data.birthday,
          profile_image_url: supaUserResponse.data.profile_image_url,
        };
      } else {
        throw new Error('User not found');
      }
    }
  }
  return (
    <div className='flex space-x-4'>
      <div className=''>
        <div className=''>
          <Avatar
            fallBack={params.user?.[0]?.toUpperCase()}
            profileImageUrl={imageCacheBuster(userData.profile_image_url)}
          ></Avatar>
        </div>
        <div>
          <div className='text-2xl'>{params.user}</div>
          <div>{userData.bio}</div>
          <div className='text-xs'>Born on {userData.birthday}</div>
        </div>
      </div>
      <div className='space-y-2'>
        {posts.map((post, index) => (
          <div key={index}>
            <Post
              post={post}
              userData={{
                display_name: params.user,
                profile_image_url: imageCacheBuster(userData.profile_image_url),
              }}
            ></Post>
          </div>
        ))}
        <ClientPosts
          displayName={params.user}
          profileImageUrl={userData.profile_image_url}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default UserPage;
