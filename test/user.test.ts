import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import routes from '../src/app.routes';
import { UserService } from '../src/services';

describe('User Routes', () => {
  let app: Elysia;

  beforeAll(() => {
    app = new Elysia().use(routes);
  });

  it('should register a new user', async () => {
    const response = await app.handle(
      new Request('http://localhost/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        })
      })
    );

    expect(response.status).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });

  it('should login a user', async () => {
    const response = await app.handle(
      new Request('http://localhost/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123'
        })
      })
    );

    expect(response.status).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('testuser');
  });

  afterAll(async () => {
    // Clean up: Delete test user
    await UserService.deleteUser('testuser');
  });
});