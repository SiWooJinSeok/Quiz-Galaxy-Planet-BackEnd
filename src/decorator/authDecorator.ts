import { HttpCode, HttpStatus, Post, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserJWTEntity } from './../entity/userEntity';
import { AUTH_ERROR_MESSAGE } from '../constant/message';
import { AUTH_RESPONSE_DESRIPTION } from '../constant/description';

export const LoginDecorator = (path: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: '로그인',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: AUTH_RESPONSE_DESRIPTION.OK,
      type: UserJWTEntity,
    }),
    createResponseMessage(
      HttpStatus.BAD_REQUEST,
      AUTH_RESPONSE_DESRIPTION.BAD_REQUEST,
      AUTH_ERROR_MESSAGE.EMAIL_OR_PASSWORD_NOT_MATCH,
    ),
    createResponseMessage(
      HttpStatus.FORBIDDEN,
      AUTH_RESPONSE_DESRIPTION.FORBIDDEN,
      AUTH_ERROR_MESSAGE.EMAIL_FORBIDDEN,
    ),
  );
};

export const SignupDecorator = (path: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({
      summary: '회원가입',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: AUTH_RESPONSE_DESRIPTION.CREATED,
    }),
  );
};

export const ConfirmEmailDecorator = (path: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
      summary: '이메일 인증',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: AUTH_RESPONSE_DESRIPTION.NO_CONTENT,
    }),
    createResponseMessage(
      HttpStatus.BAD_REQUEST,
      AUTH_RESPONSE_DESRIPTION.BAD_REQUEST,
      AUTH_ERROR_MESSAGE.CONFIRM_BAD_REQUEST,
    ),
  );
};

export const ResendConfirmEmailDecorator = (path: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
      summary: '이메일 재전송',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: AUTH_RESPONSE_DESRIPTION.NO_CONTENT,
    }),
  );
};

export const PasswordForgotDecorator = (path: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
      summary: '비밀번호 찾기 코드 보내기',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: AUTH_RESPONSE_DESRIPTION.NO_CONTENT,
    }),
  );
};

export const PasswordResetDecorator = (path: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
      summary: '비밀번호 재설정',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: AUTH_RESPONSE_DESRIPTION.NO_CONTENT,
    }),
  );
};

export const createResponseMessage = (
  status: number,
  description: string,
  message: string,
) => {
  return ApiResponse({
    status,
    description,
    schema: {
      type: 'object',
      properties: {
        message: { example: message },
      },
    },
  });
};
