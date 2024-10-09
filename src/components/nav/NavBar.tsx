import React from 'react';
import { SignInButton } from '@/components/buttons/SignInButton';
import { SignUpButton } from '@/components/buttons/SignUpButton';
import { SignOutButton } from '@/components/buttons/SignOutButton';

export const NavBar = () => {
  return (
    <>
      <div className='bg-amber-400 w-full h-14 flex justify-center items-center p-4'>
        {false ? (
          <div className='w-full h-full flex justify-between items-center'>
            <SignOutButton />
          </div>
        ) : (
          <div className='w-full h-full flex justify-between items-center'>
            <SignInButton />
            <SignUpButton />
            <SignOutButton />
          </div>
        )}
      </div>
    </>
  );
};
