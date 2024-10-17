import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
} from '@/components/buttons/AuthButtons';

export const NavBar = ({
  userData,
}: {
  userData: { displayName: string; bio: string; birthday: string } | null;
}) => {
  return (
    <>
      <div className='bg-amber-400 w-full h-14 flex justify-center items-center p-4'>
        {userData ? (
          <div className='w-full h-full flex justify-between items-center'>
            <div className='flex'>
              <a href={userData.displayName}>{userData.displayName}</a>
            </div>
            <SignOutButton />
          </div>
        ) : (
          <div className='w-full h-full flex justify-between items-center'>
            <SignInButton />
            <SignUpButton />
          </div>
        )}
      </div>
    </>
  );
};
