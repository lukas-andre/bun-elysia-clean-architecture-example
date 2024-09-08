import { Static, t } from "elysia";
import { UserProvider } from "../infrastructure/providers/user.provider";
import { generateToken } from "../../shared/infraestructure/auth/jwt";
import { verifyPassword } from "../../shared/infraestructure/auth/password";

export const LoginUserRequestSchema = t.Object({
  username: t.String(),
  password: t.String()
});

export const LoginUserResponseSchema = t.Object({
  user: t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String()
  }),
  token: t.String()
});

export type LoginUserRequest = Static<typeof LoginUserRequestSchema>;
export type LoginUserResponse = Static<typeof LoginUserResponseSchema>;

export const loginUser = async (loginData: LoginUserRequest): Promise<LoginUserResponse> => {
  const user = await UserProvider.getByUsername(loginData.username);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await verifyPassword(loginData.password, user.password_hash!);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const { id, email, username } = user;
  const token = generateToken({
    id,
    email,
    username
  });

  return {
    user: {
        id, username, email, 
    },
    token
  };
};