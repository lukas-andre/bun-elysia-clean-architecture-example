import { Elysia, t } from 'elysia'
import { UserController, NoteController } from '../controllers'
import { UserSchema, NoteSchema } from '../types'

const routes = (app: Elysia) => 
  app
    .post('/register', UserController.register, {
      body: UserSchema,
      detail: {
        tags: ['Users'],
        summary: 'Register a new user',
        description: 'Create a new user account'
      }
    })
    .post('/login', UserController.login, {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      detail: {
        tags: ['Users'],
        summary: 'User login',
        description: 'Authenticate a user and return a token'
      }
    })
    .post('/notes', NoteController.createNote, {
      body: NoteSchema,
      detail: {
        tags: ['Notes'],
        summary: 'Create a new note',
        description: 'Create a new note for the authenticated user'
      }
    })
    .get('/notes/:id', NoteController.getNoteById, {
      detail: {
        tags: ['Notes'],
        summary: 'Get a note by ID',
        description: 'Retrieve a specific note by its ID'
      }
    })
    .get('/notes/search', NoteController.searchNotes, {
      query: t.Object({
        q: t.String()
      }),
      detail: {
        tags: ['Notes'],
        summary: 'Search notes',
        description: 'Search for notes based on a query string'
      }
    })
    .put('/notes/:id', NoteController.updateNote, {
      body: NoteSchema,
      detail: {
        tags: ['Notes'],
        summary: 'Update a note',
        description: 'Update an existing note'
      }
    })
    .delete('/notes/:id', NoteController.deleteNote, {
      detail: {
        tags: ['Notes'],
        summary: 'Delete a note',
        description: 'Delete an existing note'
      }
    })

export default routes