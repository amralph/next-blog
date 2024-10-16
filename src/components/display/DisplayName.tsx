'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

export const DisplayName = () => {
  const { user } = useUser();
  return <div>{user?.nickname}</div>;
};
