'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export const NavBar = () => {
  const { userData } = useUser();

  return (
    <div className='bg-amber-400 w-full h-14 flex justify-center items-center p-4'>
      {userData ? (
        <div className='w-full h-full flex justify-between items-center'>
          <div className='flex'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {userData.displayName}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='grid w-28'>
                    <NavigationMenuLink className='w-28 m-2' asChild>
                      <Link href={`/${userData.displayName}`}>Profile</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink className='w-28 m-2' asChild>
                      <Link href={`/settings`}>Settings</Link>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Button asChild variant='link'>
            <Link href='/api/auth/logout'>Sign Out</Link>
          </Button>
        </div>
      ) : (
        <div className='w-full h-full flex justify-between items-center'>
          <Button asChild variant='link'>
            <Link href='/api/auth/signin'>Sign In</Link>
          </Button>
          <Button asChild variant='link'>
            <Link href='/api/auth/signup'>Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
