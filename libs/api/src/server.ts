import 'dotenv/config';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './trpc/router.js';
import { createContext } from './trpc/context.js';

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

const port = process.env.PORT ?? 3000;
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
