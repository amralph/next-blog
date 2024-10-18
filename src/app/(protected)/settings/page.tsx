'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { updateUserDisplayName, updateUserProfile } from './actions';

// not public, settings page

const ProfilePage = () => {
  const { userData, setUserData } = useUser();

  async function handleUpdateUserDisplayName(formData: FormData) {
    const updatedUserData = updateUserDisplayName(formData);
    const result = await updatedUserData;
    if (result === 'Success') {
      setUserData(() => ({
        ...userData,
        displayName: formData.get('displayName'),
      }));
    }
  }

  async function handleUpdateUserProfile(formData: FormData) {
    const updatedUserData = updateUserProfile(formData);
    const result = await updatedUserData;
    if (result === 'Success') {
      setUserData(() => ({
        ...userData,
        bio: formData.get('bio'),
        birthday: formData.get('birthday'),
      }));
    }
  }

  return (
    <div className='space-y-4'>
      <div>
        <h1>Profile Settings</h1>
      </div>
      <div className='bg-orange-200 p-4 rounded-lg'>
        <form action={handleUpdateUserDisplayName}>
          <div className='space-y-2'>
            <div className='space-y-2'>
              <label>Displayname</label>
              <Input
                type='text'
                id='displayName'
                name='displayName'
                defaultValue={userData?.displayName}
                className='bg-white'
              />
              <input
                type='text'
                id='oldDisplayName'
                name='oldDisplayName'
                hidden
                readOnly
                value={userData?.displayName}
              />
            </div>
            <Button type='submit'>Change displayname</Button>
          </div>
        </form>
      </div>
      <div className='bg-orange-200 p-4 rounded-lg'>
        <form action={handleUpdateUserProfile}>
          <div className='space-y-2'>
            <div className='space-y-2'>
              <label>Bio</label>
              <Input
                type='text'
                id='bio'
                name='bio'
                defaultValue={userData?.bio}
                className='bg-white'
              />
            </div>
            <div className='space-y-2'>
              <label>Birthday</label>
              <Input
                type='date'
                id='birthday'
                name='birthday'
                defaultValue={userData?.birthday}
                className='bg-white'
              />
            </div>
            <Button type='submit'>Update profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
