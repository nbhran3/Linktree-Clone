// Entry point for the Linktrees Public microservice.
// This service is responsible for serving public linktree data (read-only).

import express from "express";
import { getPublicLinktree } from "./controller/linktrees-public-controller.js";
import dotenv from "dotenv";

// Load environment variables for this service
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Parse incoming JSON (not heavily used here, but consistent with other services)
app.use(express.json());

// Simple request logger for debugging
app.use((req, _res, next) => {
  console.log("PUBLIC PATH:", req.method, req.url);
  next();
});

// Public endpoint used by the frontend to get a linktree by suffix
app.get("/linktrees/:linktreeSuffix", getPublicLinktree);

// Start HTTP server
app.listen(PORT, () => {
  console.log(`Linktrees Public Service is running on port ${PORT}`);
});
