// Frontend copies of the Zod schemas used by the backend authentication service.
// These allow us to validate login/register forms BEFORE sending requests.

import { z } from "zod";

// Schema for registration form
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for login form
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Inferred types for strongly-typed form state, if needed
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
