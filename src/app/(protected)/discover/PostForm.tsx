'use client';

import { createPost } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const PostForm = () => {
  const { toast } = useToast();
  const [postValue, setPostValue] = useState('');

  const handleCreatePost = async (formData: FormData) => {
    const createPostData = await createPost(formData);

    setPostValue('');

    if (createPostData.success) {
      toast({
        description: 'Post successful.',
      });
    } else {
      toast({
        description: 'Post unsuccessful.',
      });
    }
  };

  return (
    <form action={handleCreatePost}>
      <div className='flex'>
        <Input
          type='text'
          id='postText'
          name='postText'
          className='bg-white'
          value={postValue}
          onChange={(e) => setPostValue(e.target.value)}
          placeholder={`What's happening?`}
        />
        <Button type='submit'>Post</Button>
      </div>
    </form>
  );
};
