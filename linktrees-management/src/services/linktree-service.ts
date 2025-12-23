// Service layer for linktrees.
// Sits between controllers and repositories; good place for business rules.

import * as LinktreeRepository from "../repositories/linktree-repository.js";

// Get all linktrees belonging to a specific user
export const getLinktreesByUserId = async (userId: number) => {
  return LinktreeRepository.getLinktreesByUserId(userId);
};

// Create a new linktree for a user
export const createLinktree = async (userId: number, linktreeSuffix: string) => {
  return LinktreeRepository.createLinktree(userId, linktreeSuffix);
};

// Find a linktree by its public suffix
export const getLinktreeBySuffix = async (suffix: string) => {
  return LinktreeRepository.getLinktreeBySuffix(suffix);
};

// Get a specific linktree by id, but only if it belongs to the given user
export const getLinktreeByIdAndUserId = async (
  linktreeId: number,
  userId: number
) => {
  return LinktreeRepository.getLinktreeByIdAndUserId(linktreeId, userId);
};

// Delete a linktree that belongs to a specific user
export const deleteLinktree = async (linktreeId: number, userId: number) => {
  return LinktreeRepository.deleteLinktree(linktreeId, userId);
};
