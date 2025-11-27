import dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url); // import.meta.url returns a URL object, so we need to convert it to a file path using fileURLToPath
const __dirname = path.dirname(__filename); // path.dirname returns the directory name of the file

// Load .env from the parent directory (authentication folder)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const entitiesPath = path.join(__dirname, "entity", "*.{js,ts}"); // joins the directory name with the entity files

const AppDataSource = new DataSource({
  type: "postgres", // tells TypeORM to use PostgreSQL
  host: process.env.DB_HOST as string,
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.PG_DB as string,
  synchronize: false, // automatically creates tables from your entities if they don't exist
  logging: true, // prints every SQL query to the console
  entities: [entitiesPath], // points to the entity files
});

export default AppDataSource;
