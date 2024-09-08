import { User, Note } from '../types';
import sql from '../config/database';
import { NoteModel, UserModel } from '../models';

export const UserService = {
  registerUser: async (user: User) => {
    return await UserModel.create(user);
  },
  loginUser: async (username: string, password: string) => {
    const user = await UserModel.getByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    
    const [isValid] = await sql`SELECT verify_password(${password}, ${user.password_hash!}) AS is_valid`;
    
    if (!isValid.is_valid) {
      throw new Error('Invalid password');
    }
    
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  deleteUser: async (username: string) => {
    const deletedUser = await UserModel.deleteByUsername(username);
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  }
};

export const NoteService = {
  createNote: async (note: Note) => {
    return await NoteModel.create(note);
  },
  getNoteById: async (id: number) => {
    const note = await NoteModel.getById(id);
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  },
  searchNotes: async (query: string) => {
    const result =  await NoteModel.search(query);
    return result;
  },
  updateNote: async (id: number, note: Partial<Note>) => {
    const updatedNote = await NoteModel.update(id, note);
    if (!updatedNote) {
      throw new Error('Note not found');
    }
    return updatedNote;
  },
  deleteNote: async (id: number) => {
    const deletedNote = await NoteModel.delete(id);
    if (!deletedNote) {
      throw new Error('Note not found');
    }
    return deletedNote;
  },
  deleteAllUserNotes: async (userId: number) => {
    return await NoteModel.deleteAllByUserId(userId);
  }
};