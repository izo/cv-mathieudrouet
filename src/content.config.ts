import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cvCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cv' }),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    iconSet: z.enum(['carbon', 'tabler', 'lucide', 'heroicons', 'feather']).optional().default('carbon'),
    theme: z.enum(['lumon']).optional().default('lumon'),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  cv: cvCollection,
  about: aboutCollection,
};
