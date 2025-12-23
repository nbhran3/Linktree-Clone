// Frontend Zod schemas for linktree suffix and link creation/update.
// These mirror the backend validators so we can catch errors on the client.

import { z } from "zod";

// Schema for the "create linktree" form (suffix input)
export const createLinktreeSchema = z.object({
  linktreeSuffix: z
    .string()
    .min(3, "Suffix must be at least 3 characters")
    .max(20, "Suffix can have a maximum of 20 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Suffix can only contain lowercase letters, numbers, and hyphens"
    ),
});

// Helper function to normalize URLs: add https:// if URL starts with www. but has no protocol
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  // If it starts with www. and doesn't have http:// or https://, add https://
  if (trimmed.startsWith("www.") && !trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// Schema for link forms (create + edit)
// Automatically adds https:// to URLs starting with www. that don't have a protocol
export const linkSchema = z.object({
  linkText: z.string().min(1, "Link name is required"),
  linkUrl: z
    .string()
    .transform((url) => normalizeUrl(url))
    .pipe(z.string().url("Invalid URL format")),
});

export type CreateLinktreeInput = z.infer<typeof createLinktreeSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
