import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';

import { AuthController } from '../src/auth/infrastructure/auth.controller';
import { UserRepository } from '../src/users/infrastructure/user.repository';

describe('User Routes', () => {
  let app: Elysia;

  beforeAll(() => {
    app = new Elysia().use(AuthController);
  });

  it('should register a new user', async () => {
    await UserRepository.deleteByUsername('testuser');
    const response = await app.handle(
      new Request('http://localhost/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }),
      }),
    );

    expect(response.status).toBe(201);
    const user = await response.json();
    expect(user.data).toHaveProperty('id');
    expect(user.data.username).toBe('testuser');
  });

  it('should login a user', async () => {
    const response = await app.handle(
      new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
      }),
    );

    expect(response.status).toBe(200);
    const res = await response.json();
    console.log({ res, user: res.data.user });
    expect(res.data.user).toHaveProperty('id');
    expect(res.data.user.username).toBe('testuser');
    expect(res.data.token).toBeDefined();
  });

  afterAll(async () => {
    // Clean up: Delete test user
    await UserRepository.deleteByUsername('testuser');
  });
});
