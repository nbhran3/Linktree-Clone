// Controller for the public linktree API.
// Exposes read-only endpoints that do NOT require authentication.

import * as LinktreesPublicServices from "../services/linktrees-public-services.js";
import { Request, Response } from "express";
import { suffixSchema } from "../validators/linktrees-public-schema.js";

// GET /linktrees/:linktreeSuffix
// 1. Validate suffix path param with Zod
// 2. Try to fetch the linktree (with caching in the service layer)
// 3. Return 404 if not found, otherwise shape the response for the frontend
export const getPublicLinktree = async (req: Request, res: Response) => {
  const result = suffixSchema.safeParse(req.params.linktreeSuffix);

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  try {
    const linktreeSuffix = result.data;

    const linktree = await LinktreesPublicServices.getLinktreeBySuffix(
      linktreeSuffix
    );

    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }

    res.json({
      linktreeSuffix: linktree.linktreeSuffix,
      links: linktree.links,
    });
  } catch (error) {
    console.error("Error fetching public linktree:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
