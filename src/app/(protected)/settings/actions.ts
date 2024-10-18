'use server';

import { getSession } from '@auth0/nextjs-auth0';

export async function updateUserDisplayName(formData: FormData) {
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
      const a = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamodb/users/updateUserDisplayName`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        }
      );
      return 'Success';
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Could not get user session');
  }
}

export async function updateUserProfile(formData: FormData) {
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
      return 'Success';
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Could not get user session');
  }
}
