'use server';
import { getSession } from '@auth0/nextjs-auth0';
import { createClientWithUserSession } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserDisplayName(formData: FormData) {
  'use server';

  const displayName = formData.get('displayName');
  const userSession = await getSession();
  // only make this call if there is a userSession
  if (userSession) {
    const supabase = await createClientWithUserSession();

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ display_name: displayName }) // Set the new display name
        .eq('auth0_id', userSession.user.sub);

      if (error) {
        console.error(error);
        return {
          result: data,
          success: false,
          message: 'Error updating display_name',
        };
      } else {
        revalidatePath('/');
        return { success: true, message: 'OK' };
      }
    } else {
      console.log('Could not get supabase');
      return { success: false, message: 'Could not get supabase' };
    }
  } else {
    console.log('Could not get user session');
    return { success: false, message: 'Could not get user session' };
  }
}

export async function updateUserProfile(formData: FormData) {
  'use server';

  const bio = formData.get('bio');
  const birthday = formData.get('birthday');

  const userSession = await getSession();
  if (userSession) {
    const supabase = await createClientWithUserSession();

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ bio, birthday })
        .eq('auth0_id', userSession.user.sub);

      if (error) {
        console.error(error);
        return { success: false, message: 'Error updating profile' };
      } else {
        revalidatePath('/');
        return { result: data, success: true, message: 'OK' };
      }
    } else {
      console.log('Could not get supabase');
      return { success: false, message: 'Could not get supabase' };
    }
  } else {
    console.log('Could not get user session');
    return { success: false, message: 'Could not get user session' };
  }
}

export async function updateUserProfileImage(formData: FormData) {
  'use server';
  const userSession = await getSession();

  if (userSession) {
    const sub = userSession.user.sub;
    const profileImage = formData.get('profileImage') as File;

    const supabase = await createClientWithUserSession();

    if (profileImage) {
      if (supabase) {
        // upload file to bucket
        const { data, error } = await supabase.storage
          .from('next-blog-bucket')
          .upload(
            `profile-images/${sub.replace(/\|/g, '-')}/avatar`,
            profileImage,
            {
              upsert: true,
            }
          );

        if (error) {
          console.log('Error updating user profile in storage:', error);
          return {
            success: false,
            message: 'Error updating user profile in storage',
          };
        } else {
          const profile_image_url = supabase.storage
            .from('next-blog-bucket')
            .getPublicUrl(data.path).data.publicUrl;

          const { error } = await supabase
            .from('users')
            .update({
              profile_image_url,
            })
            .eq('auth0_id', userSession.user.sub);

          if (error) {
            console.log('Error updating user profile in table:', error);
            return {
              success: false,
              message: 'Error updating user profile in table',
            };
          } else {
            revalidatePath('/');
            return {
              profile_image_url,
              success: true,
              message: 'OK',
            };
          }
        }
      } else {
        console.log('No supabase');
        return { success: false, message: 'No supabase' };
      }
    } else {
      console.log('Could not get user session');
      return { success: false, message: 'Could not get user session' };
    }
  } else {
    console.log('No profile image');
    return { success: false, message: 'No profile image' };
  }
}
