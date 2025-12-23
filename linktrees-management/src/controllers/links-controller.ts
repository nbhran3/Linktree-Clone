// Controller for managing individual links inside a linktree.
// All routes here expect the gateway to set "x-user-id" after auth.

import * as LinksService from "../services/links-service.js";
import * as LinktreeService from "../services/linktree-service.js";
import { Request, Response } from "express";
import { linkSchema, linkIdSchema } from "../validators/links-schema";
import { linktreeIdSchema } from "../validators/linktree-schema.js";

// Create a new link for a specific linktree
export const createLink = async (req: Request, res: Response) => {
  // Validate linkText + linkUrl in body
  const bodyResult = linkSchema.safeParse(req.body);
  if (!bodyResult.success) {
    const errorMessages = bodyResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  // Validate :linktreeId path param
  const linktreeIdResult = linktreeIdSchema.safeParse(req.params.linktreeId);
  if (!linktreeIdResult.success) {
    const errorMessages = linktreeIdResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  try {
    const userId = Number(req.headers["x-user-id"]);
    const linktreeId = linktreeIdResult.data;
    const linksData: { linkText: string; linkUrl: string } = bodyResult.data;

    // Ensure the linktree belongs to this user before inserting links
    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }

    const updatedLinks = await LinksService.createLink(linktreeId, linksData);
    return res.status(201).json({
      message: "Link added successfully",
      links: updatedLinks,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a single link from a linktree
export const deleteLink = async (req: Request, res: Response) => {
  // Validate :linktreeId path param
  const linktreeIdResult = linktreeIdSchema.safeParse(req.params.linktreeId);
  if (!linktreeIdResult.success) {
    const errorMessages = linktreeIdResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  // Validate :linkId path param
  const linkIdResult = linkIdSchema.safeParse(req.params.linkId);
  if (!linkIdResult.success) {
    const errorMessages = linkIdResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }
  try {
    const userId = Number(req.headers["x-user-id"]);

    const linktreeId = linktreeIdResult.data;
    const linkId = linkIdResult.data;

    // Make sure the user owns this linktree before deleting links
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

// Update an existing link inside a linktree
export const updateLink = async (req: Request, res: Response) => {
  // Validate new linkText + linkUrl in body
  const bodyResult = linkSchema.safeParse(req.body);
  if (!bodyResult.success) {
    const errorMessages = bodyResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }
  // Validate :linktreeId path param
  const linktreeIdResult = linktreeIdSchema.safeParse(req.params.linktreeId);
  if (!linktreeIdResult.success) {
    const errorMessages = linktreeIdResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  // Validate :linkId path param
  const linkIdResult = linkIdSchema.safeParse(req.params.linkId);
  if (!linkIdResult.success) {
    const errorMessages = linkIdResult.error.issues.map(
      (issue: unknown) => (issue as any).message
    );
    return res.status(400).json({ message: errorMessages.join(", ") });
  }

  try {
    const userId = Number(req.headers["x-user-id"]);
    const linktreeId = linktreeIdResult.data;
    const linkId = linkIdResult.data;
    const { linkText, linkUrl } = bodyResult.data;

    // Ensure the user owns this linktree before updating links
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
