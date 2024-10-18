'use client';

import {
  SignInButton,
  SignUpButton,
  SignOutButton,
} from '@/components/buttons/AuthButtons';
import React from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export const NavBar = () => {
  const { userData } = useUser();

  return (
    <div className='bg-amber-400 w-full h-14 flex justify-center items-center p-4'>
      {userData ? (
        <div className='w-full h-full flex justify-between items-center'>
          <div className='flex'>
            <Link href={`${userData.displayName}`}>{userData.displayName}</Link>
          </div>
          <Link href='/users'>Users</Link>
          <SignOutButton />
        </div>
      ) : (
        <div className='w-full h-full flex justify-between items-center'>
          <SignInButton />
          <SignUpButton />
        </div>
      )}
    </div>
  );
};
