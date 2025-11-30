import * as LinktreesPublicServices from "../services/linktrees-public-services.js";
import { Request, Response } from "express";

export const getPublicLinktree = async (req: Request, res: Response) => {
  try {
    const linktreeSuffix = String(req.params.linktreeSuffix);
    const linktree = await LinktreesPublicServices.getLinktreeBySuffix(
      linktreeSuffix
    );
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    res.json({
      linktreeSuffix: linktree.linktree_suffix,
      links: linktree.links,
    });
  } catch (error) {
    console.error("Error fetching public linktree:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
