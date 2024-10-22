import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar } from '@/components/avatar/Avatar';
import { Post } from '@/components/post/Post';

const UserPage = async ({ params }: { params: { user: string } }) => {
  const userSession = await getSession();

  let userData = {
    displayName: '',
    bio: '',
    birthday: '',
    profilePictureUrl: '',
    userId: '',
  };

  let posts = [];

  if (userSession) {
    try {
      const userDataRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/users/getUserByDisplayName?displayName=${params.user}`
      );
      userData = await userDataRes.json();
    } catch (error) {
      console.log(error);
    }

    try {
      const postsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/posts/getPostsByUserId?userId=${userData.userId}`
      );
      posts = (await postsRes.json()).posts;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex space-x-4'>
      <div className=''>
        <div className=''>
          <Avatar
            fallBack={userData.displayName?.[0]?.toUpperCase()}
            profilePictureUrl={userData.profilePictureUrl}
          ></Avatar>
        </div>
        <div>
          <div className='text-2xl'>{userData.displayName}</div>
          <div>{userData.bio}</div>
          <div className='text-xs'>Born on {userData.birthday}</div>
        </div>
      </div>
      <div className='space-y-2'>
        {posts.map(
          (
            post: { postText: string; createdAt: number; userId: string },
            index: number
          ) => (
            <div key={index}>
              <Post userData={userData} postContent={post}></Post>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserPage;
