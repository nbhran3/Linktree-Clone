import * as LinktreeRepository from "../repositories/linktree-repository.js";

export const getLinktreesByUserId = async (userId: number) => {
  return LinktreeRepository.getLinktreesByUserId(userId);
};

export const createLinktree = async (
  userId: number,
  linktreeSuffix: string
) => {
  return LinktreeRepository.createLinktree(userId, linktreeSuffix);
};

export const getLinktreeBySuffix = async (
  suffix: string
) => {
  return LinktreeRepository.getLinktreeBySuffix(suffix);
};

export const getLinktreeByIdAndUserId = async (
  linktreeId: number,
  userId: number
) => {
  return LinktreeRepository.getLinktreeByIdAndUserId(linktreeId, userId);
};

export const deleteLinktree = async (linktreeId: number, userId: number) => {
  return LinktreeRepository.deleteLinktree(linktreeId, userId);
};
