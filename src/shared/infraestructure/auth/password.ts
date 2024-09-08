
export const hashPassword = async (password: string): Promise<string> => {
  return Bun.password.hash(password);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return Bun.password.verify(password, hashedPassword);
};