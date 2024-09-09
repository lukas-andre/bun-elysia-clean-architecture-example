export const hashPassword = async (password: string): Promise<string> => {
  // eslint-disable-next-line no-undef
  return await Bun.password.hash(password);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  // eslint-disable-next-line no-undef
  return await Bun.password.verify(password, hashedPassword);
};
