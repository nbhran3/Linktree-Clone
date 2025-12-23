// Controllers -> Flow manager (They check body params) and they use services
// Services -> The services use repositories to perform business logic
// Repositories -> Data access layer (DAL) -> Database queries
// This controller exposes HTTP endpoints for managing linktrees.

import * as LinktreeService from "../services/linktree-service.js";
import * as LinksService from "../services/links-service.js";
import { Request, Response } from "express";
import {
  createLinktreeSchema,
  linktreeIdSchema,
  suffixSchema,
} from "../validators/Linktree-Schema.js";

// Get all linktrees for the currently authenticated user.
// The API gateway is expected to put the user id in the "x-user-id" header.
export const getLinktrees = async (req: Request, res: Response) => {
  try {
    // Extract user id from header (set by gateway after JWT verification)
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.sendStatus(401);
    }
    const linktrees = await LinktreeService.getLinktreesByUserId(userId);
    res.json({ linktrees: linktrees });
  } catch (error) {
    console.error("Error fetching linktrees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new linktree for the current user.
// 1. Validate body with Zod
// 2. Check if suffix already exists
// 3. Create new linktree through the service layer
export const createLinktree = async (req: Request, res: Response) => {
  // Validate request body (linktreeSuffix)
  const result = createLinktreeSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.sendStatus(401);
    }
    // Safe because Zod validated the body
    const { linktreeSuffix } = result.data;

    // Ensure suffix is unique across all linktrees
    const suffixExists = await LinktreeService.getLinktreeBySuffix(
      linktreeSuffix
    );
    if (suffixExists) {
      return res
        .status(409)
        .json({ message: "Linktree suffix already exists" });
    }

    // Delegate creation to the service layer
    const newLinktree = await LinktreeService.createLinktree(
      userId,
      linktreeSuffix
    );
    res.status(201).json({
      linktreeSuffix: linktreeSuffix,
      id: newLinktree.id,
      message: "Linktree created successfully",
    });
  } catch (error) {
    console.error("Error creating linktree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single linktree and its links by linktree id for the current user.
export const getLinktreeByIdAndUserId = async (req: Request, res: Response) => {
  // Validate and coerce :linktreeId path param to a positive integer
  const result = linktreeIdSchema.safeParse(req.params.linktreeId);
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errorMessages.join(", ") });
  }
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.sendStatus(401);
    }
    const linktreeId = result.data;
    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );

    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    // Fetch all links for this linktree
    const links = await LinksService.getLinksByLinktreeId(linktreeId);
    res.json({
      id: linktree.id,
      linktreeSuffix: linktree.linktree_suffix,
      links: links,
    });
  } catch (error) {
    console.error("Error fetching links for linktree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a linktree that belongs to the current user.
export const deleteLinktree = async (req: Request, res: Response) => {
  // Validate :linktreeId path param
  const result = linktreeIdSchema.safeParse(req.params.linktreeId);
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errorMessages.join(", ") });
  }
  try {
    const userId = Number(req.headers["x-user-id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const linktreeId = result.data;
    const deletedLinktree = await LinktreeService.deleteLinktree(
      linktreeId,
      userId
    );
    if (!deletedLinktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    res.json({ message: "Linktree deleted successfully" });
  } catch (error) {
    console.error("Error deleting linktree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Public endpoint used by the public service to get linktree + links by suffix.
export const getLinktreeBySuffix = async (req: Request, res: Response) => {
  // Validate :suffix path param
  const result = suffixSchema.safeParse(req.params.suffix);
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errorMessages.join(", ") });
  }
  try {
    const linktreeSuffix = result.data;
    const linktree = await LinktreeService.getLinktreeBySuffix(linktreeSuffix);
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    const links = await LinksService.getLinksByLinktreeId(linktree.id);
    res.json({
      linktreeSuffix: linktree.linktree_suffix,
      links: links,
    });
  } catch (error) {
    console.error("Error fetching linktree by suffix:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
