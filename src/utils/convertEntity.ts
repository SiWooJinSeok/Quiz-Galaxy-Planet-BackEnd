import { UserInfoEntity } from './../entity/userEntity';
import { User } from '@prisma/client';

export const convertToUserInfoEntity = (user: User): UserInfoEntity => {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    profile_image: user?.profile_image,
    introduction: user?.introduction,
  };
};
