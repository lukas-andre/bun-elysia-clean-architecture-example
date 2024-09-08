import { Static, t } from "elysia";
import { UserProvider } from "../infrastructure/providers/user.provider";

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

  const {id, username} = await UserProvider.create(userData);
  
  return {
    id,
    username,
  };  
};
  
