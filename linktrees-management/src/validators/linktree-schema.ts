// Zod schemas for validating linktree-related data in the management service.
// Used by controllers to validate request bodies and path parameters.

import { z } from "zod";

// Schema for POST /linktrees body
export const createLinktreeSchema = z.object({
  linktreeSuffix: z
    .string()
    .min(3, "Suffix must be at least 3 characters")
    .max(20, "Suffix can have a maximum characters of 20")
    .regex(
      /^[a-z0-9-]+$/,
      "Suffix can only contain lowercase letters, numbers, and hyphens"
    ),
});

// Path parameter schemas
// :linktreeId in routes - coerces from string to number and ensures it is a positive integer
export const linktreeIdSchema = z.coerce.number().int().positive();

// :suffix in routes - non-empty string (more detailed regex is applied in createLinktreeSchema)
export const suffixSchema = z.string().min(1);

// TypeScript types inferred from schemas
export type CreateLinktreeInput = z.infer<typeof createLinktreeSchema>;
export type LinktreeId = z.infer<typeof linktreeIdSchema>;
export type Suffix = z.infer<typeof suffixSchema>;
