'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import {
  updateUserDisplayName,
  updateUserProfile,
  updateUserProfileImage,
} from './actions';
import { Avatar } from '@/components/avatar/Avatar';
import { imageCacheBuster } from '@/lib/utils/imageCacheBuster';

// not public, settings page

const ProfilePage = () => {
  const { userData, setUserData } = useUser();
  const { toast } = useToast();
  const [settingsProfileImage, setSettingsProfileImage] = useState(
    imageCacheBuster(userData?.profile_image_url)
  );
  const [imageChosen, setImageChosen] = useState(false);

  useEffect(() => {
    if (userData?.profile_image_url) {
      setSettingsProfileImage(
        `${imageCacheBuster(userData.profile_image_url)}`
      );
    }
  }, [userData?.profile_image_url]); // Run this effect when userData.profileImageUrl changes

  const handleUploadUserProfileImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSettingsProfileImage(imageUrl);
      setImageChosen(true);
    }
  };

  async function handleUpdateUserProfileImage(formData: FormData) {
    const updatedUserProfileImage = await updateUserProfileImage(formData);

    if (updatedUserProfileImage.success) {
      setUserData(() => ({
        ...userData,
        profile_image_url: updatedUserProfileImage.profile_image_url
          ? imageCacheBuster(updatedUserProfileImage.profile_image_url)
          : '',
      }));
      toast({
        description:
          'Profile image updated. Changes may take some time to become visible.',
      });
    } else {
      toast({
        description: 'Error changing profile image.',
      });
    }
  }

  async function handleUpdateUserDisplayName(formData: FormData) {
    const updatedUserData = await updateUserDisplayName(formData);

    if (updatedUserData.success) {
      setUserData(() => ({
        ...userData,
        display_name: formData.get('displayName'),
      }));
      toast({
        description: 'DisplayName updated.',
      });
    } else {
      toast({
        description: 'Error changing displayname. Try another name.',
      });
    }
  }

  async function handleUpdateUserProfile(formData: FormData) {
    const updatedUserData = await updateUserProfile(formData);
    if (updatedUserData.success) {
      setUserData(() => ({
        ...userData,
        bio: formData.get('bio'),
        birthday: formData.get('birthday'),
      }));

      toast({
        description: 'Profile updated.',
      });
    } else {
      toast({
        description: 'Error updating profile. Try again later.',
      });
    }
  }

  return (
    <div className='space-y-4'>
      <div>
        <h1>Profile Settings</h1>
      </div>
      <div className='bg-orange-200 p-4 rounded-lg'>
        <form action={handleUpdateUserProfileImage}>
          <div className='space-y-2'>
            <div className='space-y-2'>
              <label>Profile image</label>
              <Avatar
                fallBack={userData?.displayName?.[0]?.toUpperCase() || '?'}
                profileImageUrl={settingsProfileImage}
              ></Avatar>
              <Input
                type='file'
                id='profileImage'
                name='profileImage'
                accept='.png, .jpg, .jpeg'
                className='bg-white'
                onChange={handleUploadUserProfileImage}
              />
              <input
                type='text'
                id='oldProfileImageUrl'
                name='oldProfileImageUrl'
                hidden
                readOnly
                value={userData?.profile_image_url}
              />
            </div>
            <Button type='submit' disabled={!imageChosen}>
              Upload profile image
            </Button>
          </div>
        </form>
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
                defaultValue={userData?.display_name}
                className='bg-white'
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
