import * as LinksService from "../services/links-service.js";
import * as LinktreeService from "../services/linktree-service.js";
import { Request, Response } from "express";

export const createLink = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const linktreeId = Number(req.params.linktreeId);
    const linksData: { linkText: string; linkUrl: string } = req.body;

    console.log("userId:", userId, "linktreeId:", linktreeId);

    console.log("Creating link with data:", linksData);

    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }

    const updatedLinks = await LinksService.createLink(linktreeId, linksData);
    return res.status(201).json({
      // Return the updated list of links after insertion
      message: "Link added successfully",
      links: updatedLinks,
    });
  } catch (error) {
    console.error("Error creating link:", error); // ✅ Add this - it's missing!
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers["x-user-id"]);

    const linktreeId = Number(req.params.linktreeId);
    const linkId = Number(req.params.linkId);
    console.log("User ID:", userId);

    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );

    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    const deletedLinks = await LinksService.deleteLink(linkId, linktreeId);

    if (!deletedLinks) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Link deleted successfully", links: deletedLinks });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLink = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const linktreeId = Number(req.params.linktreeId);
    const linkId = Number(req.params.linkId);
    const { linkText, linkUrl } = req.body;

    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );

    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    const updatedLinks = await LinksService.updateLink(linkId, linktreeId, {
      linkText,
      linkUrl,
    });
    res.json({ message: "Link updated successfully", links: updatedLinks });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
