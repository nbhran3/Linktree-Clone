import AppDataSource from "../data-source";
import { Links } from "../entity/links";

const linksRepository = AppDataSource.getRepository(Links);

export const getLinksByLinktreeId = async (linktreeId: number) => {
  const links = await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["link_text", "link_url", "id"],
  });
  return links;
};

export const createLinks = async (
  linktreeId: number,
  links: Array<{ linkText: string; linkUrl: string }>
) => {
  const linksToInsert = links.map(({ linkText, linkUrl }) => ({
    link_text: linkText,
    link_url: linkUrl,
    linktree_id: linktreeId,
  }));
  await linksRepository.insert(linksToInsert);
  return await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["id", "link_text", "link_url"],
  });
};

export const deleteLink = async (linkId: number, linktreeId: number) => {
  const deletedLink = await linksRepository.findOne({
    where: { id: linkId, linktree_id: linktreeId },
  });
  if (!deletedLink) {
    return null; // Return null if not found
  }
  await linksRepository.delete({ id: linkId, linktree_id: linktreeId });
  const updatedLinks = await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["id", "link_text", "link_url"],
  });
  return updatedLinks;
};

export const updateLink = async (
  linkId: number,
  linktreeId: number,
  linkData: { linkText: string; linkUrl: string }
) => {
  await linksRepository.update(
    { id: linkId, linktree_id: linktreeId },
    { link_text: linkData.linkText, link_url: linkData.linkUrl }
  );
  const updatedLinks = await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["id", "link_text", "link_url"],
  });
  return updatedLinks;
};
