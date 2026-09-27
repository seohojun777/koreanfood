import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// 로컬 이미지 또는 무료 사진 사이트의 원격 이미지 URL
			heroImage: z.union([image(), z.string().url()]).optional(),
			heroImageAlt: z.string().optional(),
			category: z.string().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

export const collections = { blog };
