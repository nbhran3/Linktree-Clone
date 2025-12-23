import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  console.log("GATEWAY AUTH HEADER:", authHeader); // 👈 log header

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("GATEWAY JWT: no token found → 401"); // 👈 log reason
    res.status(401).json({ error: "Unauthorized. No token provided" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("GATEWAY JWT VERIFY ERROR:", err); // 👈 log error
      res.sendStatus(403);
      return;
    }
    console.log("GATEWAY JWT OK, USER:", user); // 👈 log decoded user
    req.user = user as { id: number; email?: string };
    next();
  });
}
