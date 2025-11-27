import "reflect-metadata";
import express from "express";
import AppDataSource from "./data-source.js";
import { authenticateToken } from "./middlewares/authenticate-token.js";
import * as linktreeController from "./controllers/linktree-controller.js";
import * as linksController from "./controllers/links-controller.js";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

async function initializeApp() {
  await AppDataSource.initialize();
  console.log("Database connected using TypeORM");

  app.get("/linktrees", authenticateToken, linktreeController.getLinktrees);

  app.post("/linktrees", authenticateToken, linktreeController.createLinktree);

  app.get(
    "/linktrees/:linktreeId",
    authenticateToken,
    linktreeController.getLinktreeByIdAndUserId
  );

  app.delete(
    "/linktrees/:linktreeId",
    authenticateToken,
    linktreeController.deleteLinktree
  );

  app.post(
    "/linktrees/:linktreeId/links",
    authenticateToken,
    linksController.createLink
  );

  app.delete(
    "/linktrees/:linktreeId/links/:linkId",
    authenticateToken,
    linksController.deleteLink
  );

  app.patch(
    "/linktrees/:linktreeId/links/:linkId",
    authenticateToken,
    linksController.updateLink
  );

  app.listen(PORT, () => {
    console.log(`Linktrees Management Service is running on port ${PORT}`);
  });
}

initializeApp().catch((error) => {
  console.error("Error initializing app:", error);
  process.exit(1);
});
