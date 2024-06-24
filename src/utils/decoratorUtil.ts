import { ApiResponse } from '@nestjs/swagger';

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
