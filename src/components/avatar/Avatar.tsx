import {
  Avatar as AvatarShadCn,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

export const Avatar = ({
  fallBack,
  profilePictureUrl,
}: {
  fallBack: string;
  profilePictureUrl: string;
}) => {
  return (
    <AvatarShadCn>
      <AvatarImage src={profilePictureUrl}></AvatarImage>
      <AvatarFallback>{fallBack}</AvatarFallback>
    </AvatarShadCn>
  );
};
