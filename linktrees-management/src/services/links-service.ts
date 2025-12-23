// Service layer for links inside a linktree.
// Encapsulates link-related operations and delegates DB access to the repository.

import * as LinksRepository from "../repositories/links-repository.js";

// Get all links that belong to a given linktree id
export const getLinksByLinktreeId = async (linktreeId: number) => {
  return LinksRepository.getLinksByLinktreeId(linktreeId);
};

// Create a new link in a linktree
export const createLink = async (
  linktreeId: number,
  linksData: { linkText: string; linkUrl: string }
) => {
  return LinksRepository.createLink(linktreeId, linksData);
};

// Delete a link from a linktree
export const deleteLink = async (linkId: number, linktreeId: number) => {
  return LinksRepository.deleteLink(linkId, linktreeId);
};

// Update an existing link in a linktree
export const updateLink = async (
  linkId: number,
  linktreeId: number,
  linkData: { linkText: string; linkUrl: string }
) => {
  return LinksRepository.updateLink(linkId, linktreeId, linkData);
};
