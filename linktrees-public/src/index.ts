import express from "express";
import { getPublicLinktree } from "./controller/linktrees-public-controller.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get("/linktrees/:linktreeSuffix/public", getPublicLinktree);

app.listen(PORT, () => {
  console.log(`Linktrees Public Service is running on port ${PORT}`);
});
