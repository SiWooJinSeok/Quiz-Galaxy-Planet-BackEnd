import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginDTO } from '../dto/authDTO';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let cognitoClient: CognitoIdentityProviderClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    cognitoClient = service['client'];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user info entity on successful login', async () => {
    const loginDTO: LoginDTO = {
      email: 'test@example.com',
      password: 'password',
    };
    const mockAuthResult: InitiateAuthCommandOutput = {
      $metadata: {},
      AuthenticationResult: {
        AccessToken: 'mockAccessToken',
        RefreshToken: 'mockRefreshToken',
      },
    };
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      nickname: 'test',
      profile_image: null,
      introduction: null,
    };

    jest.spyOn(cognitoClient, 'send').mockImplementation(() => {
      return mockAuthResult;
    });
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.login(loginDTO);

    expect(result).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      id: mockUser.id,
      nickname: mockUser.nickname,
      email: mockUser.email,
      profile_image: mockUser.profile_image,
      introduction: mockUser.introduction,
    });
  });

  it('should throw an error if authentication fails', async () => {
    const loginDTO: LoginDTO = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    jest
      .spyOn(cognitoClient, 'send')
      .mockImplementation(() => new Error('Authentication failed'));

    await expect(service.login(loginDTO)).rejects.toThrow(Error);
  });
});
