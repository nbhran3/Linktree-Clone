// Entry point for the Linktrees Management microservice.
// Responsible for:
// - Bootstrapping the database connection
// - Creating the Express app
// - Wiring HTTP routes to controllers

import "reflect-metadata"; // Required by TypeORM
import express from "express";
import AppDataSource from "./data-source.js";
import * as linktreeController from "./controllers/linktree-controller.js";
import * as linksController from "./controllers/links-controller.js";

// Create the Express application
const app = express();
const PORT = process.env.PORT || 3002;

// Parse incoming JSON bodies so req.body is available
app.use(express.json());

async function initializeApp() {
  // Initialize the TypeORM data source (connects to Postgres)
  await AppDataSource.initialize();
  console.log("Database connected using TypeORM");

  // -------- Linktrees routes (protected via gateway adding x-user-id header) --------

  // Get all linktrees for the current user
  app.get("/", linktreeController.getLinktrees);

  // Create a new linktree for the current user
  app.post("/", linktreeController.createLinktree);

  // Get a single linktree (and its links) by id for the current user
  app.get("/:linktreeId", linktreeController.getLinktreeByIdAndUserId);

  // Delete a linktree belonging to the current user
  app.delete("/:linktreeId", linktreeController.deleteLinktree);

  // -------- Links routes (operate on a specific linktree) --------

  // Create a new link inside a linktree
  app.post("/:linktreeId/links", linksController.createLink);

  // Delete a link from a linktree
  app.delete("/:linktreeId/links/:linkId", linksController.deleteLink);

  // Update an existing link in a linktree
  app.patch("/:linktreeId/links/:linkId", linksController.updateLink);

  // Public route: get linktree + links by suffix (no auth)
  app.get("/:suffix/public", linktreeController.getLinktreeBySuffix);

  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`Linktrees Management Service is running on port ${PORT}`);
  });
}

// Bootstrap the app and crash the process on startup error
initializeApp().catch((error) => {
  console.error("Error initializing app:", error);
  process.exit(1);
});
