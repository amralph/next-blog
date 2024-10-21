'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import {
  updateUserDisplayName,
  updateUserProfile,
  updateUserProfilePicture,
} from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// not public, settings page

const ProfilePage = () => {
  const { userData, setUserData } = useUser();
  const { toast } = useToast();
  const [settingsProfilePicture, setSettingsProfilePicture] = useState(
    userData?.profilePictureUrl
  );
  const [pictureChosen, setPictureChosen] = useState(false);

  useEffect(() => {
    if (userData?.profilePictureUrl) {
      setSettingsProfilePicture(userData.profilePictureUrl);
    }
  }, [userData?.profilePictureUrl]); // Run this effect when userData.profilePictureUrl changes

  const handleUploadUserProfilePicture = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSettingsProfilePicture(imageUrl);
      setPictureChosen(true);
    }
  };

  async function handleUpdateUserProfilePicture(formData: FormData) {
    const updatedUserProfilePicture = updateUserProfilePicture(formData);

    const result = await updatedUserProfilePicture;

    if (result.success) {
      setUserData(() => ({
        ...userData,
        profilePictureUrl: result.profilePictureUrl,
      }));
      toast({
        description: 'Profile picture updated.',
      });
    } else {
      toast({
        description: 'Error changing profile picture.',
      });
    }
  }

  async function handleUpdateUserDisplayName(formData: FormData) {
    const updatedUserData = updateUserDisplayName(formData);
    const result = await updatedUserData;
    if (result.success) {
      setUserData(() => ({
        ...userData,
        displayName: formData.get('displayName'),
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
    const updatedUserData = updateUserProfile(formData);
    const result = await updatedUserData;
    if (result.success) {
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
        <form action={handleUpdateUserProfilePicture}>
          <div className='space-y-2'>
            <div className='space-y-2'>
              <label>Profile picture</label>
              <Avatar>
                <AvatarImage src={settingsProfilePicture}></AvatarImage>
                <AvatarFallback>
                  {userData?.displayName?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input
                type='file'
                id='profilePicture'
                name='profilePicture'
                accept='.png, .jpg, .jpeg'
                className='bg-white'
                onChange={handleUploadUserProfilePicture}
              />
              <input
                type='text'
                id='oldProfilePictureUrl'
                name='oldProfilePictureUrl'
                hidden
                readOnly
                value={userData?.profilePictureUrl}
              />
            </div>
            <Button type='submit' disabled={!pictureChosen}>
              Upload profile picture
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
