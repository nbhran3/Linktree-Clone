import AppDataSource from "../data-source.js";
import { Links } from "../entity/links.js";

const linksRepository = AppDataSource.getRepository(Links);

export const getLinksByLinktreeId = async (linktreeId: number) => {
  const links = await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["link_text", "link_url", "id"],
  });
  return links;
};

export const createLink = async (
  linktreeId: number,
  links: { linkText: string; linkUrl: string }
) => {
  const linkToInsert = {
    link_text: links.linkText,
    link_url: links.linkUrl,
    linktree_id: linktreeId,
  };

  await linksRepository.insert(linkToInsert);
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
