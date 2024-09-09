import { Static, t } from "elysia";
import { UserProvider } from "../../users/infrastructure/providers/user.provider";
import { hashPassword } from "../../shared/infraestructure/auth/password";

export const RegisterUserRequestSchema = t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String()
  });
  
export const RegisteUserResponseSchema = t.Object({
    id: t.Number(),
    username: t.String(),
});
    
export type RegisterUserRequest = Static<typeof RegisterUserRequestSchema>;
export type RegisteUserResponse = Static<typeof RegisteUserResponseSchema>;  

export const registerUser = async (userData: RegisterUserRequest): Promise<RegisteUserResponse> => {
  const existingUser = await UserProvider.getByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  userData.password = await hashPassword(userData.password)

  const {id, username} = await UserProvider.create(userData);
  
  return {
    id,
    username,
  };  
};
  
