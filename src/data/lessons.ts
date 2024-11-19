import { getCollection, type InferEntrySchema } from "astro:content";

import { titleCase } from "title-case";

const DEFAULT_ICON = "info-circle";

interface Section {
  title: string;
  icon: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  body: string;
  collection: "lessons";
  data: InferEntrySchema<"lessons">;
}

interface ParsedSlug {
  section: string;
  lesson: string;
}

interface SlugInfo {
  slug: string;
  order: string;
  title: string;
}

export async function getSections() {
  const lessons = await getCollection("lessons");
  const metas = await getCollection("metas");

  const sectionsMap = new Map<string, Section>();

  for (const lesson of lessons) {
    const { section: sectionTitle, lesson: lessonTitle } = parseSlug(
      lesson.slug
    );

    if (!sectionsMap.has(sectionTitle)) {
      const meta = metas.find((m) => m.id === sectionTitle);
      sectionsMap.set(sectionTitle, {
        icon: meta?.data.icon ?? DEFAULT_ICON,
        title: slugify(sectionTitle).title,
        lessons: [{ ...lesson, title: slugify(lessonTitle).title }],
      });
    } else {
      sectionsMap
        .get(sectionTitle)
        ?.lessons.push({ ...lesson, title: slugify(lessonTitle).title });
    }
  }

  return Array.from(sectionsMap.values());
}

export async function getMetas() {
  const metas = await getCollection("metas");
  return metas.map((meta) => {
    const { title } = slugify(meta.id);
    return {
      ...meta,
      icon: meta.data.icon ?? DEFAULT_ICON,
      title: meta.data.title ?? title,
    };
  });
}

function slugify(inputPath: string): SlugInfo {
  const pathParts = inputPath.split("-");
  const pathOrder = pathParts.shift() || "999";
  const pathSlug = pathParts.join("-");
  return {
    slug: pathSlug,
    order: pathOrder,
    title: titleCase(pathParts.join(" ")),
  };
}

function getTitle(slug: string, override?: string) {
  let title = override;
  if (!title) {
    title = titleCase(slug.split("-").join(" "));
  }

  return title;
}

function parseSlug(slug: string): ParsedSlug {
  const parts = slug.split("/");
  return {
    section: parts[0],
    lesson: parts[1],
  };
}
