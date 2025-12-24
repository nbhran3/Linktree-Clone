// Controllers -> Flow manager (They check body params) and they use services
// Services -> The services use repositories to perform business logic
// Repositories -> Data access layer (DAL) -> Database queries
// This controller handles the HTTP layer for the authentication service.

import * as AuthenticationService from "../services/authentication-service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/auth-schema";

// Number of salt rounds for bcrypt password hashing
const SALT_ROUNDS = 10;

// Secret key used to sign JWTs. In production this MUST come from an environment variable.
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Handle user registration
// 1. Validate body with Zod
// 2. Check if user already exists
// 3. Hash password and save new user through the service layer
export const registerUser = async (req: Request, res: Response) => {
  // Validate the request body against the register schema
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ error: errorMessages.join(",") });
  }

  // Safe to use because Zod validated the shape
  const { email, password } = result.data;

  try {
    // Check if a user with this email already exists
    const existingUser = await AuthenticationService.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the plain-text password before saving
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Delegate user creation to the service layer
    await AuthenticationService.createUser(email, hashedPassword);

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Handle user login
// 1. Validate body with Zod
// 2. Find user by email
// 3. Compare passwords
// 4. Issue JWT token if credentials are valid
export const loginUser = async (req: Request, res: Response) => {
  // Validate the request body against the login schema
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ error: errorMessages.join(",") });
  }

  // Safe to use because Zod validated the shape
  const { email, password } = result.data;

  try {
    // Look up the user by email through the service layer
    const user = await AuthenticationService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the plain-text password with the stored hash
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a signed JWT containing the user id and email
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h", // token validity
    });

    return res.json({
      message: "Login successful",
      token: token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
