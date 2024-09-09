
export const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await Bun.password.verify(password, hashedPassword);
};