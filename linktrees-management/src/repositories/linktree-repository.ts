import AppDataSource from "../data-source";
import { Linktree } from "../entity/linktree";

const linktreeRepository = AppDataSource.getRepository(Linktree);

export const getLinktreesByUserId = async (userId: number) => {
  const linktrees = await linktreeRepository.find({
    where: { user_id: userId },
    select: ["id", "linktree_suffix"],
  });
  return linktrees;
};

export const createLinktree = async (
  userId: number,
  linktreeSuffix: string
) => {
  const newLinktree = linktreeRepository.create({
    user_id: userId,
    linktree_suffix: linktreeSuffix,
  });
  await linktreeRepository.save(newLinktree);
  return newLinktree;
};

export const getLinktreeBySuffix = async (suffix: string) => {
  const linktree = await linktreeRepository.findOne({
    where: { linktree_suffix: suffix },
  });
  return linktree;
};

export const getLinktreeByIdAndUserId = async (
  linktreeId: number,
  userId: number
) => {
  const linktree = await linktreeRepository.findOne({
    where: { id: linktreeId, user_id: userId },
    select: ["id", "linktree_suffix"],
  });
  return linktree;
};

export const deleteLinktree = async (linktreeId: number, userId: number) => {
  const deletedLinktree = await linktreeRepository.findOne({
    where: { id: linktreeId, user_id: userId },
  });
  if (!deletedLinktree) {
    return null;
  }
  await linktreeRepository.delete({ id: linktreeId, user_id: userId });
  return { message: "Linktree deleted successfully" };
};
