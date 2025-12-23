// TypeORM DataSource configuration for the Linktrees Management service.
// Knows how to connect to Postgres and where entities + migrations are located.

import dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "path";

// Load .env from the parent directory (management folder)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Globs for entity and migration files
const entitiesPath = path.join(__dirname, "entity", "*.{js,ts}");
const migrationsPath = path.join(__dirname, "migrations", "*.{js,ts}");

const AppDataSource = new DataSource({
  type: "postgres", // Use PostgreSQL
  host: process.env.DB_HOST as string,
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.PG_DB || "linktree_management",
  synchronize: false, // We rely on migrations, not auto schema sync
  logging: true, // Log SQL queries (useful during development)
  entities: [entitiesPath], // Where to find entity classes
  migrations: [migrationsPath], // Where to find migrations
});

export default AppDataSource;
