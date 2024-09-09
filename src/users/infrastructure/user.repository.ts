import sql from '../../shared/infrastructure/db';
import { User } from '../domain/user.type';

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserParms {
  username: string;
  email: string;
  password: string;
}

export class UserRepository {
  static async create(user: CreateUserParms): Promise<UserRecord> {
    const [newUser] = await sql<UserRecord[]>`
      INSERT INTO users (username, email, password_hash)
      VALUES (${user.username}, ${user.email}, ${user.password})
      RETURNING id, username, email, created_at, updated_at
    `;
    return newUser;
  }

  static async getByUsername(
    username: string,
  ): Promise<UserRecord | undefined> {
    const [user] = await sql<UserRecord[]>`
      SELECT id, username, email, password_hash, created_at, updated_at
      FROM users
      WHERE username = ${username}
    `;
    return user;
  }

  static async deleteByUsername(username: string): Promise<User | undefined> {
    const [deletedUser] = await sql<User[]>`
      DELETE FROM users
      WHERE username = ${username}
      RETURNING id, username, email, created_at, updated_at
    `;
    return deletedUser;
  }
}
