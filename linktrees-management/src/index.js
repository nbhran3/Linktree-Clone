import express from "express";
import jwt from "jsonwebtoken";
import AppDataSource from "./data-source.js";
import Linktree from "./entity/linktree.js";
import user from "../../authentication/src/entity/user.js";
import linktree from "./entity/linktree.js";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
app.use(express.json());
await AppDataSource.initialize();
console.log("Database connected using TypeORM");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function getRepository(entity) {
  return AppDataSource.getRepository(entity);
}

app.get("/linktrees", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const linktreeRepository = getRepository(Linktree);
    const linktrees = await linktreeRepository.find({
      select: ["linktree_suffix"],
      where: { user_id: userId },
    });
    res.json({ userId: userId, linktrees: linktrees });
  } catch (error) {
    console.error("Error fetching linktrees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/linktrees", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { linktreeSuffix } = req.body;
    const linktreeRepository = getRepository(Linktree);
    linktreeRepository.insert({
      user_id: userId,
      linktreeSuffix: linktreeSuffix,
    });
    res.status(201).json({ message: "Linktree created successfully" });
  } catch (error) {
    console.error("Error creating linktree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/linktrees/:linktreeId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const linktreeId = Number(req.params.linktreeId);
    const linktreesRepository = getRepository(Linktree);
    const linktree = await linktreesRepository.findOne({
      where: { id: linktreeId, user_id: userId },
      select: ["linktree_suffix", "id"],
    });
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    const linksRepository = getRepository(Links);
    const links = await linksRepository.find({
      where: { linktree_id: linktreeId },
      select: ["link_text", "link_url", "id"],
    });
    res.json({ links: links, linktree: linktree });
  } catch (error) {
    console.error("Error fetching links for linktree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/linktrees/:linktreeId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const linktreeId = req.params.linktreeId;
    const linktreeRepository = getRepository(Linktree);
    const deleteResult = await linktreeRepository.delete({
      user_id: userId,
      linktreeId: linktreeId,
    });
  } catch (error) {
    console.error("Error deleting linktree:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

app.post(
  "/linktrees/:linktreeId/links",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const linktreeId = Number(req.params.linktreeId);
      const linksData = req.body;
      const linksRepository = getRepository(Links);

      const rowsToInsert = linksData.map(({ linkText, linkUrl }) => ({
        // Map creates a new array with key values that fit the entity aswell adding linktree_id
        link_text: linkText,
        link_url: linkUrl,
        linktree_id: linktreeId,
      }));
      const insertResult = await linksRepository.insert(rowsToInsert);
      const updatedLinks = await linksRepository.find({
        where: { linktree_id: linktreeId },
        select: ["id", "link_text", "link_url"],
      });

      return res.status(201).json({
        // Return the updated list of links after insertion
        message: "Links added successfully",
        links: updatedLinks,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.delete(
  "/linktrees/:linktreeId/links/:linkId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const linktreeId = Number(req.params.linktreeId);
      const linkId = Number(req.params.linkId);
      const linksRepository = getRepository(Links);
      const deleteResult = await linksRepository.delete({
        id: linkId,
        linktree_id: linktreeId,
      });
      const updatedLinks = await linksRepository.find({
        where: { linktree_id: linktreeId },
        select: ["id", "link_text", "link_url"],
      });
      res.json({ message: "Link deleted successfully", links: updatedLinks });
    } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.patch(
  "/linktrees/:linktreeId/links/:linkId",
  authenticateToken,
  async (req, res) => {
    try {
      const linktreeId = Number(req.params.linktreeId);
      const linkId = Number(req.params.linkId);
      const { linkText, linkUrl } = req.body;
      const linksRepository = getRepository(Links);
      const updateResult = await linksRepository.update(
        { id: linkId, linktree_id: linktreeId },
        { link_text: linkText, link_url: linkUrl }
      );
      const updatedLinks = await linksRepository.find({
        where: { linktree_id: linktreeId },
        select: ["id", "link_text", "link_url"],
      });
      res.json({ message: "Link updated successfully", links: updatedLinks });
    } catch (error) {
      console.error("Error updating link:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Linktrees Management Service is running on port ${PORT}`);
});
