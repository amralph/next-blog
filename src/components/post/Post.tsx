import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/avatar/Avatar';

export const Post = ({
  post,
  userData,
}: {
  post: { content: string; created_at: string; image_url: string };
  userData: {
    display_name: string;
    profile_image_url: string;
  };
}) => {
  return (
    <div className='flex space-x-2'>
      <div>
        <Avatar
          fallBack={userData.display_name[0].toUpperCase()}
          profileImageUrl={userData.profile_image_url}
        ></Avatar>
      </div>
      <div>
        <p>
          <Link href={`${userData.display_name}`}>{userData.display_name}</Link>
        </p>
        <p>{post.content}</p>
        <p>{new Date(post.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
