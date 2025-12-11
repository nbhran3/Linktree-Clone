import dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "path";

// Load .env from the parent directory (management folder)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const entitiesPath = path.join(__dirname, "entity", "*.{js,ts}"); // joins the directory name with the entity files
const migrationsPath = path.join(__dirname, "migrations", "*.{js,ts}"); // joins the directory name with the migration files

const AppDataSource = new DataSource({
  type: "postgres", // tells TypeORM to use PostgreSQL
  host: process.env.DB_HOST as string,
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.PG_DB || "linktree_management",
  synchronize: false, // use migrations instead of auto-sync
  logging: true, // prints every SQL query to the console
  entities: [entitiesPath], // points to the entity files
  migrations: [migrationsPath], // points to migration files
});

export default AppDataSource;
