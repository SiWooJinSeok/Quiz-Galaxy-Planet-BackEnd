export interface UserInfoEntity {
  id: number;
  nickname: string;
  email: string;
  profile_image?: string;
  introduction?: string;
}

export interface UserJWTEntity extends UserInfoEntity {
  accessToken: string;
  refreshToken: string;
}
