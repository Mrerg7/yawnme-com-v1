import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const topics = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    description: z.string(),
    accent: z.enum(['teal', 'coral', 'sand', 'sky']),
    order: z.number(),
  }),
});

export const collections = { topics };
