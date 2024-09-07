import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import routes from '../src/routes';
import { UserService, NoteService } from '../src/services';

describe('Note Routes', () => {
  let app: Elysia;
  let userId: number;

  beforeAll(async () => {
    app = new Elysia().use(routes);
    const user = await UserService.registerUser({
      username: 'noteuser',
      email: 'noteuser@example.com',
      password: 'password123'
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
          tags: ['test', 'note']
        })
      })
    );

    expect(response.status).toBe(200);
    const note = await response.json();
    expect(note).toHaveProperty('id');
    expect(note.title).toBe('Test Note');
    expect(note.content).toBe('This is a test note');
    expect(note.tags).toEqual(['test', 'note']);
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
          tags: ['another', 'test']
        })
      })
    );
    const createdNote = await createResponse.json();

    const response = await app.handle(
      new Request(`http://localhost/notes/${createdNote.id}`)
    );

    expect(response.status).toBe(200);
    const note = await response.json();
    expect(note.id).toBe(createdNote.id);
    expect(note.title).toBe('Another Test Note');
  });

  it('should search notes', async () => {
    const response = await app.handle(
      new Request('http://localhost/notes/search?q=test')
    );

    expect(response.status).toBe(200);
    const notes = await response.json();
    expect(Array.isArray(notes)).toBe(true);
    expect(notes.length).toBeGreaterThan(0);
    expect(notes[0]).toHaveProperty('id');
    expect(notes[0]).toHaveProperty('title');
  });

  afterAll(async () => {
    // Clean up: Delete test user and their notes
    await NoteService.deleteAllUserNotes(userId);
    await UserService.deleteUser('noteuser');
  });
});