import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { UserInfoEntity, UserJWTEntity } from './../entity/userEntity';
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

export const convertToJWTUserInfoEntity = (
  user: User,
  AuthenticationResult: AuthenticationResultType,
): UserJWTEntity => {
  if (!AuthenticationResult) {
    throw new Error('AuthenticationResult is not exist');
  }

  const userInfo = convertToUserInfoEntity(user);

  return {
    accessToken: AuthenticationResult.AccessToken,
    refreshToken: AuthenticationResult.RefreshToken,
    ...userInfo,
  };
};
