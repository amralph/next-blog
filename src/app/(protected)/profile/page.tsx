import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
// not public, settings page

const ChildComponent: React.FC = async () => {
  async function updateUser(formData: FormData) {
    'use server';
    const userSession = await getSession();

    if (userSession) {
      const sub = userSession.user.sub;
      const rawFormData = {
        displayName: formData.get('displayName'),
        birthday: formData.get('birthday'),
        bio: formData.get('bio'),
      };

      const profileData = {
        sub,
        ...rawFormData,
      };

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/updateUser`,
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/getUser?userID=${userSession.user.sub}`
      );
      userData = await res.json();
      console.log(userData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form action={updateUser}>
        <div>
          <label>Display Name</label>
          <input
            type='text'
            id='displayName'
            name='displayName'
            defaultValue={userData.displayName || ''}
          />
        </div>
        <div>
          <label>Birthday</label>
          <input
            type='date'
            id='birthday'
            name='birthday'
            defaultValue={userData.birthday || ''}
          />
        </div>
        <div>
          <label>Bio</label>
          <input
            type='text'
            id='bio'
            name='bio'
            defaultValue={userData.bio || ''}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default ChildComponent;
