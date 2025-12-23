// Entry point for the Authentication microservice.
// This file wires together Express, the database connection and the controllers.

import "reflect-metadata"; // Required by TypeORM to add metadata to entities
import express from "express";
import cors from "cors";
import AppDataSource from "./data-source";
import * as AuthenticationController from "./controllers/authentication-controller";

// Create the Express application instance
const app = express();

// Enable CORS so the frontend (running on a different origin) can call this API
app.use(cors());

// Parse incoming JSON request bodies (req.body)
app.use(express.json());

// Port on which the authentication service will listen
const PORT = process.env.PORT || 3001;

// Simple request logger to see all incoming requests to this service
app.use((req, _res, next) => {
  console.log("AUTH PATH:", req.method, req.url);
  next();
});

// Route for user registration - handled by the controller
app.post("/register", AuthenticationController.registerUser);

// Route for user login - handled by the controller
app.post("/login", AuthenticationController.loginUser);

// Initialize the database connection and then start the HTTP server
const main = async () => {
  console.log("Database connected via TypeORM");

  // Initialize the TypeORM data source (creates DB connection pool)
  await AppDataSource.initialize();

  // Start listening for HTTP requests
  app.listen(PORT, () => {
    console.log(`Authentication server is running on port ${PORT}`);
  });
};

// Run the bootstrap function
main();
