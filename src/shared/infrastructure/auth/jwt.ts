import jwt from 'jsonwebtoken';

import { User } from '../../../users/domain/user.type';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user: Omit<User, 'password'>): string => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const verifyToken = (token: string): Omit<User, 'password'> => {
  return jwt.verify(token, JWT_SECRET) as Omit<User, 'password'>;
};
