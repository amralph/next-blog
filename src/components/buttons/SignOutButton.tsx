import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const SignOutButton = () => {
  return (
    <Button asChild variant='link'>
      <Link href='/api/auth/logout'>Sign Out</Link>
    </Button>
  );
};
