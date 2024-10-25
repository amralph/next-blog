import {
  Avatar as AvatarShadCn,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

export const Avatar = ({
  fallBack,
  profileImageUrl,
}: {
  fallBack: string;
  profileImageUrl: string;
}) => {
  return (
    <AvatarShadCn>
      <AvatarImage src={profileImageUrl}></AvatarImage>
      <AvatarFallback>{fallBack}</AvatarFallback>
    </AvatarShadCn>
  );
};
