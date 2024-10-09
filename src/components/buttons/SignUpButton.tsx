import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const SignUpButton = () => {
  return (
    <Button asChild variant='link'>
      <Link href='/api/auth/signup'>Sign Up</Link>
    </Button>
  );
};
