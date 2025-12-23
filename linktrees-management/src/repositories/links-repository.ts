// Repository layer for Links entity.
// Only this file should directly use TypeORM for link operations.

import AppDataSource from "../data-source.js";
import { Links } from "../entity/links.js";

// Get the TypeORM repository for Links
const linksRepository = AppDataSource.getRepository(Links);

// Return all links for a given linktree id
export const getLinksByLinktreeId = async (linktreeId: number) => {
  const links = await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["link_text", "link_url", "id"],
  });
  return links;
};

// Create a new link and return all links for that linktree
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

  // Return the updated list of links
  return await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["id", "link_text", "link_url"],
  });
};

// Delete a link from a linktree and return updated links (or null if not found)
export const deleteLink = async (linkId: number, linktreeId: number) => {
  const deletedLink = await linksRepository.findOne({
    where: { id: linkId, linktree_id: linktreeId },
  });

  if (!deletedLink) {
    return null; // Return null if the link does not exist
  }

  await linksRepository.delete({ id: linkId, linktree_id: linktreeId });

  const updatedLinks = await linksRepository.find({
    where: { linktree_id: linktreeId },
    select: ["id", "link_text", "link_url"],
  });

  return updatedLinks;
};

// Update a link and return all links for that linktree
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
