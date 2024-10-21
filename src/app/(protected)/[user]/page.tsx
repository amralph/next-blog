import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserPage = async ({ params }: { params: { user: string } }) => {
  const userSession = await getSession();

  let userData = {
    displayName: '',
    bio: '',
    birthday: '',
    profilePictureUrl: '',
  };

  if (userSession) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/users/getUserByDisplayName?displayName=${params.user}`
      );
      userData = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex space-x-4'>
      <div className='flex justify-center items-center'>
        <Avatar>
          <AvatarImage src={userData.profilePictureUrl}></AvatarImage>
          <AvatarFallback>
            {userData.displayName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className='text-2xl'>{userData.displayName}</div>
        <div>{userData.bio}</div>
        <div className='text-xs'>Born on {userData.birthday}</div>
      </div>
    </div>
  );
};

export default UserPage;
