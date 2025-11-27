import * as LinksService from "../services/links-service";
import * as LinktreeService from "../services/linktree-service";
import { Request, Response } from "express";

export const createLink = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const linktreeId = Number(req.params.linktreeId);
    const linksData: Array<{ linkText: string; linkUrl: string }> = req.body;
    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }

    const updatedLinks = await LinksService.createLinks(linktreeId, linksData);
    return res.status(201).json({
      // Return the updated list of links after insertion
      message: "Links added successfully",
      links: updatedLinks,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);

    const linktreeId = Number(req.params.linktreeId);
    const linkId = Number(req.params.linkId);

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
    const userId = Number(req.user?.id);
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
