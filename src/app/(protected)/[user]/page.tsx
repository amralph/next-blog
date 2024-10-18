import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';

const UserPage = async ({ params }: { params: { user: string } }) => {
  const userSession = await getSession();

  let userData = {
    displayName: '',
    bio: '',
    birthday: '',
  };

  if (userSession) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/getUserByDisplayName?displayName=${params.user}`
      );
      userData = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className='text-2xl'>{userData.displayName}</div>
      <div>{userData.bio}</div>
      <div className='text-xs'>Born on {userData.birthday}</div>
    </div>
  );
};

export default UserPage;
