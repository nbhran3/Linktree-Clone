import "reflect-metadata";
import express from "express";
import cors from "cors";
import AppDataSource from "./data-source.js";
import * as AuthenticationController from "./controllers/authentication-controller.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/auth/register", AuthenticationController.registerUser);
app.post("/auth/login", AuthenticationController.loginUser);

const main = async () => {
  // Initialize TypeORM connection
  console.log("Database connected via TypeORM");
  await AppDataSource.initialize();

  app.listen(PORT, () => {
    console.log("Authentication server is running on port 3000");
  });
};

main();