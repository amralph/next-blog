import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const DiscoverPage = async () => {
  const createPost = async (formData: FormData) => {
    'use server';
    const userSession = await getSession();

    if (userSession) {
      const sub = userSession.user.sub;

      const postText = formData.get('postText');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/posts/createPost`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sub, postText }),
        }
      );
    }
  };

  // load posts
  let posts: { postText: string; createdAt: number; userId: string }[] = [];
  let users: {
    userId: string;
    displayName: string;
    email: string;
    bio: string;
    birthday: string;
    profilePictureUrl: string;
  }[] = [];

  let fullPosts: {
    postText: string;
    createdAt: number;
    userId: string;
    user: {
      userId: string;
      displayName: string;
      email: string;
      bio: string;
      birthday: string;
      profilePictureUrl: string;
    };
  }[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/posts/getPosts`
    );

    const data = await res.json();

    posts = data.posts;
    users = data.users;

    fullPosts = posts.map((post) => {
      // Find the user corresponding to the post's userId

      const user = users.find((user) => user.userId === post.userId);

      return {
        ...post,
        user: user
          ? {
              displayName: user.displayName,
              profilePictureUrl: user.profilePictureUrl,
            }
          : {
              userId: '',
              displayName: '',
              email: '',
              bio: '',
              birthday: '',
              profilePictureUrl: '',
            },
      };
    });
    console.log('fp', fullPosts);
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <div className=''>
        <form action={createPost}>
          <Input
            type='text'
            id='postText'
            name='postText'
            className='bg-white'
          />
          <Button type='submit'>Post</Button>
        </form>
      </div>
      <div>
        <div className='space-y-2'>
          {fullPosts.map((fullPost, index) => (
            <div key={index} className='flex space-x-2'>
              <div>
                <Avatar>
                  <AvatarImage
                    src={fullPost.user.profilePictureUrl}
                  ></AvatarImage>
                  <AvatarFallback>
                    {fullPost.user.displayName?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1>
                  <Link href={`/${fullPost.user.displayName}`}>
                    {fullPost.user.displayName}
                  </Link>
                </h1>
                <p>{fullPost.postText}</p>
                <p>{fullPost.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          {/* client side component specifically for loading tweets in the client*/}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
