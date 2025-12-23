// Zod schemas for validating link-related data (create/update + path params).

import { z } from "zod";

// Schema for link body when creating or updating a link
export const linkSchema = z.object({
  // Text shown on the button (cannot be empty)
  linkText: z.string().min(1, "Link name is required"),
  // Must be a valid URL (Zod .url() will enforce this)
  linkUrl: z.string().url("Invalid URL format"),
});

// Path parameter schema for :linkId - coerces to positive integer
export const linkIdSchema = z.coerce.number().int().positive();

// TypeScript types inferred from schemas
export type LinkInput = z.infer<typeof linkSchema>;
export type LinkId = z.infer<typeof linkIdSchema>;

