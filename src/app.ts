import logger from 'logixlysia';
import swagger from '@elysiajs/swagger';
import { env } from './shared/infrastructure/env';
import { AppRoutes } from './app.routes';
import Elysia from 'elysia';

const app = new Elysia()
  .use(logger())
  .use(
    swagger({
      exclude: ['/swagger'],
      autoDarkMode: true,
      documentation: {
        info: {
          title: '🦊 Elysia Clean Architecture',
          description:
            'Clean Architecture pattern for ElysiaJS + Bun + Postgres.js',
          version: '1.0.0',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/license/mit/',
          },
          contact: {
            name: 'Lucas André Henry',
            url: 'https://www.linkedin.com/in/lucas-henryd/',
          },
        },
      },
    }),
  )
  .use(AppRoutes);

app.listen({ port: env.PORT });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
