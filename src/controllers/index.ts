import { UserService, NoteService } from '../services';
import { User, Note } from '../types';

export const UserController = {
  register: async ({ body }: { body: User }) => {
    return await UserService.registerUser(body);
  },
  login: async ({ body }: { body: { username: string, password: string } }) => {
    return await UserService.loginUser(body.username, body.password);
  },

};

export const NoteController = {
  createNote: async ({ body }: { body: Note }) => {
    return await NoteService.createNote(body);
  },
  getNoteById: async ({ params }: { params: { id: string } }) => {
    return await NoteService.getNoteById(Number(params.id));
  },
  searchNotes: async ({ query }: { query: { q: string } }) => {
    return await NoteService.searchNotes(query.q);
  },
  updateNote: async ({ params, body }: { params: { id: string }, body: Partial<Note> }) => {
    return await NoteService.updateNote(Number(params.id), body);
  },
  deleteNote: async (id: number) => {
    return await NoteService.deleteNote(id);
  },

};