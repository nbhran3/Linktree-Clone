// TypeORM DataSource configuration for the Authentication service.
// This is responsible for connecting to PostgreSQL and knowing where entities and migrations live.

import dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "path";

// In CommonJS, __dirname is available directly (no need for import.meta.url)

// Load environment variables from the .env file in the authentication folder
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Path pattern for entity files (User entity, etc.)
const entitiesPath = path.join(__dirname, "entity", "*.{js,ts}");

// Path pattern for migration files
const migrationsPath = path.join(__dirname, "migrations", "*.{js,ts}");

// Create the DataSource instance used across the authentication service
const AppDataSource = new DataSource({
  type: "postgres", // Database engine
  host: process.env.DB_HOST as string, // DB hostname
  port: Number(process.env.PG_PORT) || 5432, // DB port
  username: process.env.DB_USER as string, // DB user
  password: process.env.DB_PASS as string, // DB password
  database: process.env.PG_DB || "linktree_authentication", // DB name
  migrations: [migrationsPath], // Where to find migration files
  synchronize: false, // We use migrations instead of auto-syncing entities
  logging: true, // Log all SQL queries (useful in development)
  entities: [entitiesPath], // Where to find entity classes
});

export default AppDataSource;
