// Zod schemas for validating authentication request bodies.
// These are used both on the backend (controllers) and can be reused on the frontend.

import { z } from "zod";

// Schema for /register requests
export const registerSchema = z.object({
  // Must be a valid email address
  email: z.string().email("Invalid email address"),
  // Must be at least 6 characters long
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for /login requests
export const loginSchema = z.object({
  // Must be a valid email address
  email: z.string().email("Invalid email address"),
  // We only require that a password is present (non-empty)
  password: z.string().min(1, "Password is required"),
});

// Inferred TypeScript types from the schemas (handy for strong typing)
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
