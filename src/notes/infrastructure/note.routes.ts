import Elysia, { t } from 'elysia';
import { getNoteById } from '../application/getNoteById';
import { NoteSchema } from '../domain/note.type';
import { createNote } from '../application/createNote';
import { updateNote } from '../application/updateNote';
import { getAllNotes } from '../application/getAllNotes';
import { deleteNote } from '../application/deleteNote';

const route = new Elysia()
  .get(
    'notes',
    async ({ set }) => {
      try {
        const notes = await getAllNotes();
        return { status: 'success', data: notes };
      } catch (e) {
        set.status = 500;
        return { status: 'error', message: 'Internal Server Error' };
      }
    },
    {
      response: {
        200: t.Object({
          status: t.String(),
          data: t.Array(NoteSchema),
        }),
        500: t.Object({
          status: t.String(),
          message: t.String(),
        }),
      },
      detail: {
        tags: ['Notes'],
        summary: 'Get all notes',
        description: 'Retrieve a list of all notes',
      },
    },
  )
  .get(
    'notes/:id',
    async ({ params: { id }, set }) => {
      try {
        const note = await getNoteById(Number(id));
        if (!note) {
          set.status = 404;
          return { status: 'error', message: 'Note not found' };
        }
        return { status: 'success', data: note };
      } catch (e) {
        set.status = 500;
        return { status: 'error', message: 'Internal Server Error' };
      }
    },
    {
      response: {
        200: t.Object({
          status: t.String(),
          data: NoteSchema,
        }),
        404: t.Object({
          status: t.String(),
          message: t.String(),
        }),
        500: t.Object({
          status: t.String(),
          message: t.String(),
        }),
      },
      detail: {
        tags: ['Notes'],
        summary: 'Get a note by ID',
        description: 'Retrieve a specific note by its ID',
      },
    },
  )
  .post(
    'notes',
    async ({ body, set }) => {
      try {
        const note = await createNote(body.user_id, body.title, body.content);
        set.status = 201;
        return { status: 'success', data: note };
      } catch (e) {
        set.status = 500;
        return { status: 'error', message: 'Internal Server Error' };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
        user_id: t.Number(),
      }),
      response: {
        201: t.Object({
          status: t.String(),
          data: NoteSchema,
        }),
        500: t.Object({
          status: t.String(),
          message: t.String(),
        }),
      },
      detail: {
        tags: ['Notes'],
        summary: 'Create a new note',
        description: 'Create a new note with the provided title and content',
      },
    },
  )
  .put(
    'notes/:id',
    async ({ params: { id }, body, set }) => {
      try {
        const note = await updateNote(Number(id), body.title, body.content);
        if (!note) {
          set.status = 404;
          return { status: 'error', message: 'Note not found' };
        }
        return { status: 'success', data: note };
      } catch (e) {
        set.status = 500;
        return { status: 'error', message: 'Internal Server Error' };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
      }),
      response: {
        200: t.Object({
          status: t.String(),
          data: NoteSchema,
        }),
        404: t.Object({
          status: t.String(),
          message: t.String(),
        }),
        500: t.Object({
          status: t.String(),
          message: t.String(),
        }),
      },
      detail: {
        tags: ['Notes'],
        summary: 'Update a note',
        description: 'Update an existing note with new title and content',
      },
    },
  )
  .delete(
    'notes/:id',
    async ({ params: { id }, set }) => {
      try {
        const deleted = await deleteNote(Number(id));
        if (!deleted) {
          set.status = 404;
          return { status: 'error', message: 'Note not found' };
        }
        return { status: 'success', message: 'Note deleted successfully' };
      } catch (e) {
        set.status = 500;
        return { status: 'error', message: 'Internal Server Error' };
      }
    },
    {
      response: {
        200: t.Object({
          status: t.String(),
          message: t.String(),
        }),
        404: t.Object({
          status: t.String(),
          message: t.String(),
        }),
        500: t.Object({
          status: t.String(),
          message: t.String(),
        }),
      },
      detail: {
        tags: ['Notes'],
        summary: 'Delete a note',
        description: 'Delete a specific note by its ID',
      },
    },
  );

export { route };
