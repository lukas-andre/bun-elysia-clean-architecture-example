import { Static, t } from 'elysia';

import { generateToken } from '../../shared/infrastructure/auth/jwt';
import { verifyPassword } from '../../shared/infrastructure/auth/password';
import { UserRepository } from '../../users/infrastructure/user.repository';

export const LoginUserRequestSchema = t.Object({
  username: t.String(),
  password: t.String(),
});

export const LoginUserResponseSchema = t.Object({
  user: t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
  }),
  token: t.String(),
});

export type LoginUserRequest = Static<typeof LoginUserRequestSchema>;
export type LoginUserResponse = Static<typeof LoginUserResponseSchema>;

export const loginUseCase = async (
  loginData: LoginUserRequest,
): Promise<LoginUserResponse> => {
  const user = await UserRepository.getByUsername(loginData.username);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await verifyPassword(
    loginData.password,
    user.password_hash!,
  );

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const { id, email, username } = user;
  const token = generateToken({
    id,
    email,
    username,
  });

  return {
    user: {
      id,
      username,
      email,
    },
    token,
  };
};
