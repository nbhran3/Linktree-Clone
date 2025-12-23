// Zod schemas for validating link-related data (create/update + path params).

import { z } from "zod";

// Helper function to normalize URLs: add https:// if URL starts with www. but has no protocol
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  // If it starts with www. and doesn't have http:// or https://, add https://
  if (trimmed.startsWith("www.") && !trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// Schema for link body when creating or updating a link
export const linkSchema = z.object({
  // Text shown on the button (cannot be empty)
  linkText: z.string().min(1, "Link name is required"),
  // Automatically adds https:// to URLs starting with www. that don't have a protocol
  // Must be a valid URL (Zod .url() will enforce this)
  linkUrl: z
    .string()
    .transform((url) => normalizeUrl(url))
    .pipe(z.string().url("Invalid URL format")),
});

// Path parameter schema for :linkId - coerces to positive integer
export const linkIdSchema = z.coerce.number().int().positive();

// TypeScript types inferred from schemas
export type LinkInput = z.infer<typeof linkSchema>;
export type LinkId = z.infer<typeof linkIdSchema>;

