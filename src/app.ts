import logger  from 'logixlysia';
import { CreateElysia } from './shared/framework/elysia';
import swagger from '@elysiajs/swagger';
import { env } from './shared/infraestructure/env';
import { APIRoute } from './routes';

const server = CreateElysia()
  .use(logger())
  .use(
    swagger({
      exclude: ['/swagger'],
      autoDarkMode: true,
      documentation: {
        info: {
          title: '🦊 Elysia Clean Architecture',
          description: 'Clean Architecture pattern for ElysiaJS + Postgres.js, inspired on https://github.com/PunGrumpy/old-elysia-mvc-simple',
          version: '1.0.0',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/license/mit/'
          },
          contact: {
            name: 'Lucas André Henry',
            url: 'https://www.linkedin.com/in/lucas-henryd/'
          }
        }
      }
    })
  )
  .use(APIRoute)

server.listen({ port: env.PORT });

console.log(`🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`);