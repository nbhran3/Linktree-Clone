// Controllers -> Flow manager (They check body params) and they use services
// Services -> The services use repositories to perform business logic
// Repositories -> Data access layer (DAL) -> Database queries

import * as LinktreeService from "../services/linktree-service";
import * as LinksService from "../services/links-service";
import { Request, Response } from "express";
import validator from "validator";

export const getLinktrees = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
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

export const createLinktree = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.sendStatus(401);
    }
    const { linktreeSuffix } = req.body;
    if (!linktreeSuffix) {
      return res.status(400).json({ message: "linktreeSuffix is required" });
    }
    const isValidSuffix = validator.isAlphanumeric(linktreeSuffix);
    if (!isValidSuffix) {
      return res.status(400).json({ message: "Invalid linktree suffix" });
    }
    const suffixExists = await LinktreeService.getLinktreeBySuffix(
      linktreeSuffix
    );
    if (suffixExists) {
      return res
        .status(409)
        .json({ message: "Linktree suffix already exists" });
    }

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

export const getLinktreeByIdAndUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.sendStatus(401);
    }
    const linktreeId = Number(req.params.linktreeId);
    const linktree = await LinktreeService.getLinktreeByIdAndUserId(
      linktreeId,
      userId
    );

    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
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

export const deleteLinktree = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const linktreeId = Number(req.params.linktreeId);
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

export const getLinktreeBySuffix = async (req: Request, res: Response) => {
  try {
    const linktreeSuffix = String(req.params.suffix);
    const linktree = await LinktreeService.getLinktreeBySuffix(linktreeSuffix);
    if (!linktree) {
      return res.status(404).json({ message: "Linktree not found" });
    }
    const links = await LinksService.getLinksByLinktreeId(linktree.id);
    console.log("links", links);
    res.json({
      linktreeSuffix: linktree.linktree_suffix,
      links: links,
    });
  } catch (error) {
    console.error("Error fetching linktree by suffix:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
