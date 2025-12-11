import "reflect-metadata";
import express from "express";
import cors from "cors";
import AppDataSource from "./data-source";
import * as AuthenticationController from "./controllers/authentication-controller";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use((req, _res, next) => {
  console.log("AUTH PATH:", req.method, req.url);
  next();
});

app.post("/register", AuthenticationController.registerUser);
app.post("/login", AuthenticationController.loginUser);

const main = async () => {
  console.log("Database connected via TypeORM");
  await AppDataSource.initialize();

  app.listen(PORT, () => {
    console.log(`Authentication server is running on port ${PORT}`);
  });
};

main();
