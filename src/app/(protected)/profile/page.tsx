import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// not public, settings page

const ProfilePage = async () => {
  async function updateUserDisplayName(formData: FormData) {
    'use server';
    const userSession = await getSession();

    if (userSession) {
      const sub = userSession.user.sub;
      const rawFormData = {
        displayName: formData.get('displayName'),
        oldDisplayName: formData.get('oldDisplayName'),
      };

      const profileData = {
        sub,
        ...rawFormData,
      };

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/updateUserDisplayName`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Could not get user session');
    }
  }

  async function updateUserProfile(formData: FormData) {
    'use server';
    const userSession = await getSession();

    if (userSession) {
      const sub = userSession.user.sub;
      const rawFormData = {
        displayName: formData.get('displayName'),
        birthday: formData.get('birthday'),
        bio: formData.get('bio'),
        oldDisplayName: formData.get('oldDisplayName'),
      };

      const profileData = {
        sub,
        ...rawFormData,
      };

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/updateUserProfile`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Could not get user session');
    }
  }

  const userSession = await getSession();

  let userData = {
    displayName: '',
    bio: '',
    birthday: '',
  };

  if (userSession) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/getUserById?userId=${userSession.user.sub}`
      );
      userData = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='space-y-4'>
      <div>
        <h1>Profile Settings</h1>
      </div>
      <div className='bg-orange-200 p-4 rounded-lg'>
        <form action={updateUserDisplayName}>
          <div className='space-y-2'>
            <div className='space-y-2'>
              <label>Displayname</label>
              <Input
                type='text'
                id='displayName'
                name='displayName'
                defaultValue={userData.displayName}
                className='bg-white'
              />
              <input
                type='text'
                id='oldDisplayName'
                name='oldDisplayName'
                hidden
                readOnly
                value={userData.displayName}
              />
            </div>
            <Button type='submit'>Change displayname</Button>
          </div>
        </form>
      </div>
      <div className='bg-orange-200 p-4 rounded-lg'>
        <form action={updateUserProfile}>
          <div className='space-y-2'>
            <div className='space-y-2'>
              <label>Bio</label>
              <Input
                type='text'
                id='bio'
                name='bio'
                defaultValue={userData.bio}
                className='bg-white'
              />
            </div>
            <div className='space-y-2'>
              <label>Birthday</label>
              <Input
                type='date'
                id='birthday'
                name='birthday'
                defaultValue={userData.birthday}
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
