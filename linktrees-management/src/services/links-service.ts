import * as LinksRepository from "../repositories/links-repository.js";

export const getLinksByLinktreeId = async (linktreeId: number) => {
  return LinksRepository.getLinksByLinktreeId(linktreeId);
};

export const createLink = async (
  // ✅ rename to match repository
  linktreeId: number,
  linksData: { linkText: string; linkUrl: string }
) => {
  return LinksRepository.createLink(linktreeId, linksData);
};
export const deleteLink = async (linkId: number, linktreeId: number) => {
  return LinksRepository.deleteLink(linkId, linktreeId);
};

export const updateLink = async (
  linkId: number,
  linktreeId: number,
  linkData: { linkText: string; linkUrl: string }
) => {
  return LinksRepository.updateLink(linkId, linktreeId, linkData);
};
