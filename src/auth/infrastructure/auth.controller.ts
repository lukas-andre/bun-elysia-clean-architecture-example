import Elysia, { t } from 'elysia';
import {
  registerUseCase,
  RegisterUserRequestSchema,
  RegisteUserResponseSchema,
} from '../application/register.usecase';
import {
  loginUseCase,
  LoginUserRequestSchema,
  LoginUserResponseSchema,
} from '../application/login.usecase';

export const AuthController = new Elysia().group('/auth', (app) =>
  app
    .post(
      '/register',
      async ({ body, set }) => {
        try {
          const newUser = await registerUseCase(body);
          set.status = 201;
          return { status: 'success', data: newUser };
        } catch (error) {
          set.status = 400;
          return {
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Registration failed',
          };
        }
      },
      {
        body: RegisterUserRequestSchema,
        response: {
          201: t.Object({
            status: t.Literal('success'),
            data: RegisteUserResponseSchema,
          }),
          400: t.Object({
            status: t.Literal('error'),
            message: t.String(),
          }),
        },
        detail: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description: 'Create a new user account',
        },
      },
    )
    .post(
      '/login',
      async ({ body, set }) => {
        try {
          const { user, token } = await loginUseCase({
            password: body.password,
            username: body.username,
          });
          return { status: 'success', data: { user, token } };
        } catch (error) {
          set.status = 401;
          return {
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Authentication failed',
          };
        }
      },
      {
        body: LoginUserRequestSchema,
        response: {
          200: t.Object({
            status: t.Literal('success'),
            data: LoginUserResponseSchema,
          }),
          401: t.Object({
            status: t.Literal('error'),
            message: t.String(),
          }),
        },
        detail: {
          tags: ['Auth'],
          summary: 'User login',
          description: 'Authenticate a user and return a token',
        },
      },
    ),
);

