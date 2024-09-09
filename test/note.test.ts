import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';

import { registerUseCase } from '../src/auth/application/register.usecase';
import { NoteController } from '../src/notes/infrastructure/note.controller';
import { NoteRepository } from '../src/notes/infrastructure/note.repository';
import { UserRepository } from '../src/users/infrastructure/user.repository';

describe('Note Routes', () => {
  let app: Elysia;
  let userId: number;

  beforeAll(async () => {
    app = new Elysia().use(NoteController);
    const user = await registerUseCase({
      username: 'noteuser3',
      email: 'noteuser3@example.com',
      password: 'password123',
    });
    userId = user.id;
  });

  it('should create a new note', async () => {
    const response = await app.handle(
      new Request('http://localhost/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: 'Test Note',
          content: 'This is a test note',
          tags: ['test', 'note'],
        }),
      }),
    );

    expect(response.status).toBe(201);
    const note = await response.json();
    expect(note.data).toHaveProperty('user_id');
    expect(note.data.title).toBe('Test Note');
    expect(note.data.content).toBe('This is a test note');
  });

  it('should get a note by id', async () => {
    const createResponse = await app.handle(
      new Request('http://localhost/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: 'Another Test Note',
          content: 'This is another test note',
          tags: ['another', 'test'],
        }),
      }),
    );
    const createdNote = await createResponse.json();
    console.log({ createdNote });
    const response = await app.handle(
      new Request(`http://localhost/notes/${createdNote.data.id}`),
    );

    expect(response.status).toBe(200);
    const note = await response.json();
    expect(note.data.id).toBe(createdNote.data.id);
    expect(note.data.title).toBe('Another Test Note');
  });

  // it('should search notes', async () => {
  //   const response = await app.handle(
  //     // eslint-disable-next-line no-undef
  //     new Request('http://localhost/notes/search?q=test'),
  //   );

  //   expect(response.status).toBe(200);
  //   const notes = await response.json();
  //   expect(Array.isArray(notes)).toBe(true);
  //   expect(notes.length).toBeGreaterThan(0);
  //   expect(notes[0]).toHaveProperty('id');
  //   expect(notes[0]).toHaveProperty('title');
  // });

  afterAll(async () => {
    // Clean up: Delete test user and their notes
    await NoteRepository.deleteAllByUserId(userId);
    await UserRepository.deleteByUsername('noteuser3');
  });
});
