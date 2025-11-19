import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppDataSource from "./data-source.js";
import User from "./entity/user.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Initialize TypeORM connection
await AppDataSource.initialize();
console.log("Database connected via TypeORM");

// Generic helper function to get any repository (scales better as you add more entities)
function getRepository(entity) {
  return AppDataSource.getRepository(entity);
}

app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRepository = getRepository(User);

    // TypeORM: Check if user exists (replaces: SELECT * FROM users WHERE email = $1)
    const existingUser = await userRepository.findOne({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // TypeORM: Create and save user (replaces: INSERT INTO users (email, password_hash) VALUES ($1, $2))
    const newUser = userRepository.create({
      email: email,
      password_hash: hashedPassword,
    });

    const savedUser = await userRepository.save(newUser);
    console.log("Saved user object:", savedUser);

    // Return user without password
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRepository = getRepository(User);

    // TypeORM: Find user by email (replaces: SELECT * FROM users WHERE email = $1)
    const user = await userRepository.findOne({
      where: { email: email },
    });

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
      console.log("User object before token sign:", user);
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
      });
      console.log("Token signed with payload:", { id: user.id, email: user.email });
      
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
});

app.listen(PORT, () => {
  console.log("Authentication server is running on port 3000");
});
