import { defineCollection, z } from "astro:content";

const lessonSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// *.md
const lessonsCollection = defineCollection({
  type: "content",
  schema: lessonSchema,
});

// meta.json
const metaSchema = z.object({
  title: z.string().optional(),
  icon: z.string().optional(),
});

const metasCollection = defineCollection({
  type: "data", // JSON
  schema: metaSchema,
});

export const collections = {
  lessons: lessonsCollection,
  metas: metasCollection,
};

// export type LessonSchema = z.infer<typeof lessonSchema>;
// export type MetaSchema = z.infer<typeof metaSchema>;
