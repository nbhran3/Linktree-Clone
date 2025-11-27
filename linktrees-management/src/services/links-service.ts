import * as LinksRepository from "../repositories/links-repository";

export const getLinksByLinktreeId = async (linktreeId: number) => {
  return LinksRepository.getLinksByLinktreeId(linktreeId);
};

export const createLinks = async (
  linktreeId: number,
  linksData: Array<{ linkText: string; linkUrl: string }>
) => {
  return LinksRepository.createLinks(linktreeId, linksData);
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
