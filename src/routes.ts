import { route as UserRoute} from './users/infrastructure/routes'
import { route as NoteRoute} from './notes/infrastructure/routes'
import { CreateElysia } from "./shared/framework/elysia"

const route = CreateElysia({ prefix: '/api' })
    .use(UserRoute)
    .use(NoteRoute)

export { route as APIRoute }