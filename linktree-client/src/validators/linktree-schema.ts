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

// Schema for link forms (create + edit)
export const linkSchema = z.object({
  linkText: z.string().min(1, "Link name is required"),
  linkUrl: z.string().url("Invalid URL format"),
});

export type CreateLinktreeInput = z.infer<typeof createLinktreeSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
