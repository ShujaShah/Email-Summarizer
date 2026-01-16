import { z } from 'zod';
import { insertEmailSchema, emails } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  emails: {
    list: {
      method: 'GET' as const,
      path: '/api/emails',
      responses: {
        200: z.array(z.custom<typeof emails.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/emails',
      input: insertEmailSchema,
      responses: {
        201: z.custom<typeof emails.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/emails/:id',
      responses: {
        200: z.custom<typeof emails.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    summarize: {
      method: 'POST' as const,
      path: '/api/emails/:id/summarize',
      responses: {
        200: z.custom<typeof emails.$inferSelect>(),
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/emails/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  workflow: {
    run: {
      method: 'POST' as const,
      path: '/api/workflow/run',
      responses: {
        200: z.object({ message: z.string(), count: z.number() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
