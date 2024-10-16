'use client';
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
} from '@/components/buttons/AuthButtons';
import { useUser } from '@auth0/nextjs-auth0/client';

export const NavBar = () => {
  const { user } = useUser();

  return (
    <>
      <div className='bg-amber-400 w-full h-14 flex justify-center items-center p-4'>
        {user ? (
          <div className='w-full h-full flex justify-between items-center'>
            <div className='flex'>Hello {user?.nickname}</div>
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
