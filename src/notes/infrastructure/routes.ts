import { t } from 'elysia';
import { CreateElysia } from '../../shared/framework/elysia';
import { getNoteById } from '../application/getNoteById';
import { NoteSchema } from '../domain/note.type';
import { createNote } from '../application/createNote';
import { deleteNote, updateNote } from '../application/updateNote';
import { getAllNotes } from '../application/getAllNotes';

const route = CreateElysia({ prefix: '/notes' })
  .get('/', async ({ set }) => {
    try {
      const notes = await getAllNotes();
      return { status: 'success', data: notes };
    } catch (e) {
      set.status = 500;
      return { status: 'error', message: 'Internal Server Error' };
    }
  }, {
    response: {
      200: t.Object({
        status: t.String(),
        data: t.Array(NoteSchema)
      }),
      500: t.Object({
        status: t.String(),
        message: t.String()
      })
    }
  })
  .get('/:id', async ({ params: { id }, set }) => {
    try {
      const note = await getNoteById(Number(id))
      // const note = await getNoteById(Number(id));
      if (!note) {
        set.status = 404;
        return { status: 'error', message: 'Note not found' };
      }
      return { status: 'success', data: note };
    } catch (e) {
      set.status = 500;
      return { status: 'error', message: 'Internal Server Error' };
    }
  }, {
    response: {
      200: t.Object({
        status: t.String(),
        data: NoteSchema,
      }),
      404: t.Object({
        status: t.String(),
        message: t.String()
      }),
      500: t.Object({
        status: t.String(),
        message: t.String()
      })
    }
  })
  .post('/', async ({ body, set }) => {
    try {
      const note = await createNote(body.title, body.content);
      set.status = 201;
      return { status: 'success', data: note };
    } catch (e) {
      set.status = 500;
      return { status: 'error', message: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      title: t.String(),
      content: t.String()
    }),
    response: {
      201: t.Object({
        status: t.String(),
        data: NoteSchema
      }),
      500: t.Object({
        status: t.String(),
        message: t.String()
      })
    }
  })
  .put('/:id', async ({ params: { id }, body, set }) => {
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
  }, {
    body: t.Object({
      title: t.String(),
      content: t.String()
    }),
    response: {
      200: t.Object({
        status: t.String(),
        data: NoteSchema
      }),
      404: t.Object({
        status: t.String(),
        message: t.String()
      }),
      500: t.Object({
        status: t.String(),
        message: t.String()
      })
    }
  })
  .delete('/:id', async ({ params: { id }, set }) => {
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
  }, {
    response: {
      200: t.Object({
        status: t.String(),
        message: t.String()
      }),
      404: t.Object({
        status: t.String(),
        message: t.String()
      }),
      500: t.Object({
        status: t.String(),
        message: t.String()
      })
    }
  });

export { route };