'use server';
import { getSession } from '@auth0/nextjs-auth0';
import { createClientWithUserSession } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export const createPost = async (formData: FormData) => {
  'use server';
  const userSession = await getSession();

  if (userSession) {
    const sub = userSession.user.sub;

    const postText = formData.get('postText');

    const supabase = await createClientWithUserSession();

    if (supabase) {
      const { data: usersData, error } = await supabase
        .from('users')
        .select('uuid')
        .eq('auth0_id', sub)
        .single();

      if (error || !usersData.uuid) {
        return {
          success: false,
          message: 'Error getting uuid',
        };
      } else {
        const uuid = usersData.uuid;

        const { data: postsData, error } = await supabase
          .from('posts')
          .insert({ user_uuid: uuid, content: postText });

        if (error) {
          return {
            success: false,
            message: 'Error posting post',
          };
        } else {
          revalidatePath('/');
          return {
            success: true,
            message: 'OK',
          };
        }
      }
    } else {
      return {
        success: false,
        message: 'No supabase',
      };
    }
  } else {
    return {
      success: false,
      message: 'No user session',
    };
  }
};
