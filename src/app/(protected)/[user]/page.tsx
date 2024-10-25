import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar } from '@/components/avatar/Avatar';
import { Post } from '@/components/post/Post';
import { imageCacheBuster } from '@/lib/utils/imageCacheBuster';
import { createClientWithUserSession } from '@/lib/supabase/server';

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
      // get user by displayName
      const { data, error } = await supabase
        .from('users')
        .select(
          'bio, birthday, profile_image_url, posts (content, created_at, image_url) '
        )
        .eq('display_name', params.user)
        .order('created_at', { referencedTable: 'posts', ascending: false })
        .single();

      if (data) {
        posts = data.posts;

        userData = {
          bio: data.bio,
          birthday: data.birthday,
          profile_image_url: data.profile_image_url,
        };
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
      </div>
    </div>
  );
};

export default UserPage;
