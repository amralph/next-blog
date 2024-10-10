import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const SignInButton = () => {
  return (
    <Button asChild variant='link'>
      <Link href='/api/auth/signin'>Sign In</Link>
    </Button>
  );
};

export const SignOutButton = () => {
  return (
    <Button asChild variant='link'>
      <Link href='/api/auth/logout'>Sign Out</Link>
    </Button>
  );
};

export const SignUpButton = () => {
  return (
    <Button asChild variant='link'>
      <Link href='/api/auth/signup'>Sign Up</Link>
    </Button>
  );
};
