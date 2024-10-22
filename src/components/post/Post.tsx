import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/avatar/Avatar';

export const Post = ({
  postContent,
  userData,
}: {
  postContent: { postText: string; createdAt: number; userId: string };
  userData: {
    userId: string;
    displayName: string;
    profilePictureUrl: string;
  };
}) => {
  return (
    <div className='flex space-x-2'>
      <div>
        <Avatar
          fallBack={userData.displayName[0].toUpperCase()}
          profilePictureUrl={userData.profilePictureUrl}
        ></Avatar>
      </div>
      <div>
        <p>
          <Link href={`${userData.displayName}`}>{userData.displayName}</Link>
        </p>
        <p>{postContent.postText}</p>
        <p>{new Date(postContent.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
