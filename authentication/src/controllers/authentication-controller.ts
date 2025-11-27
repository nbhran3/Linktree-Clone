// Controllers -> Flow manager (They check body params) and they use services
// Services -> The services use repositories to perform business logic
// Repositories -> Data access layer (DAL) -> Database queries

import * as AuthenticationService from "../services/authentication-service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import validator from "validator";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const existingUser = await AuthenticationService.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await AuthenticationService.createUser(email, hashedPassword);

    // Return user without password
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // TypeORM: Find user by email (replaces: SELECT * FROM users WHERE email = $1)
    const user = await AuthenticationService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    else {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
      });

      return res.json({
        message: "Login successful",
        token: token,
        user: { id: user.id, email: user.email },
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
