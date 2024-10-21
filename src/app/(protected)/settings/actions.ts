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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/users/updateUserDisplayName`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        }
      );

      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, message: res.statusText };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: error };
    }
  } else {
    console.log('Could not get user session');
    return { success: false, message: 'Could not get user session' };
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/users/updateUserProfile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        }
      );
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, message: res.statusText };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: error };
    }
  } else {
    console.log('Could not get user session');
    return { success: false, message: 'Could not get user session' };
  }
}

export async function updateUserProfilePicture(formData: FormData) {
  'use server';
  const userSession = await getSession();

  if (userSession) {
    const sub = userSession.user.sub;
    const profilePicture = formData.get('profilePicture');
    const oldProfilePictureUrl = formData.get('oldProfilePictureUrl');

    if (profilePicture) {
      const newFormData = new FormData();
      newFormData.append('userId', sub);
      newFormData.append('file', profilePicture);
      newFormData.append('folder', 'profile-pictures');

      // scale down file size would be nice

      if (oldProfilePictureUrl) {
        newFormData.append('oldProfilePictureUrl', oldProfilePictureUrl);
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/s3/uploadUserProfilePicture`,
          {
            method: 'POST',
            body: newFormData,
          }
        );

        const data = await res.json();
        const profilePictureUrl = data.profilePictureUrl;

        if (res.ok) {
          return { success: true, profilePictureUrl };
        } else {
          return { success: false, message: res.statusText };
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: error };
      }
    } else {
      console.log('No profile picture');
      return { success: false, message: 'No profile picture' };
    }

    // upload file to s3
  } else {
    console.log('Could not get user session');
    return { success: false, message: 'Could not get user session' };
  }
}
