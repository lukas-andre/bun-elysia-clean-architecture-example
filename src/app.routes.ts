import { AuthController } from './auth/infrastructure/auth.controller';
import { NoteController } from './notes/infrastructure/note.controller';
import Elysia from 'elysia';

export const AppRoutes = new Elysia({ prefix: 'api/v1' })
  .use(AuthController)
  .use(NoteController);

