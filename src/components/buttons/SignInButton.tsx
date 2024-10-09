import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const SignInButton = () => {
  return (
    <Button asChild variant='link'>
      <Link href='/api/auth/signin'>Sign In</Link>
    </Button>
  );
};
