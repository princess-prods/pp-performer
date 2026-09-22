import { initTRPC } from '@trpc/server';
import type { Context } from './context.js';

interface ZodIssue {
  path: (string | number)[];
  message: string;
}

function parseZodErrors(error: Error): { field: string; message: string }[] | null {
  try {
    const parsed = JSON.parse(error.message) as ZodIssue[];
    if (Array.isArray(parsed)) {
      return parsed.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
    }
  } catch {
    // Not JSON, return null
  }
  return null;
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    const zodErrors =
      error.code === 'BAD_REQUEST' && error.cause instanceof Error
        ? parseZodErrors(error.cause)
        : null;

    const friendlyMessage = zodErrors
      ? zodErrors.map((e) => `${e.field}: ${e.message}`).join('; ')
      : shape.message;

    return {
      ...shape,
      message: friendlyMessage,
      data: {
        ...shape.data,
        validationErrors: zodErrors,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
