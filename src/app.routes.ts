import Elysia from 'elysia';

import { AuthController } from './auth/infrastructure/auth.controller';
import { NoteController } from './notes/infrastructure/note.controller';

const routes = new Elysia({ prefix: 'api/v1' })
  .use(AuthController)
  .use(NoteController);

export { routes as AppRoutes };
