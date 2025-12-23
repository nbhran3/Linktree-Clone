// Single link row inside a linktree, with optional inline editing and delete actions.
// Uses Zod to validate edits before calling the parent onEdit handler.

import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { linkSchema } from "../validators/linktree-schema";

type LinkData = {
  id: number;
  link_url: string;
  link_text: string;
};

type LinkProps = {
  link: LinkData;
  onDelete?: (linkId: number) => void;
  onEdit?: (
    linkId: number,
    linkData: { linkUrl: string; linkText: string }
  ) => void;
  isEditable?: boolean;
};

function LinkItem({ link, onDelete, onEdit, isEditable = true }: LinkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLinkUrl, setEditLinkUrl] = useState(link.link_url);
  const [editLinkText, setEditLinkText] = useState(link.link_text);
  const [errors, setErrors] = useState<{ linkText?: string; linkUrl?: string }>(
    {}
  );

  // Update URL input and clear its error
  function handleLinkUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditLinkUrl(event.target.value);
    if (errors.linkUrl) setErrors((prev) => ({ ...prev, linkUrl: undefined }));
  }

  // Update text input and clear its error
  function handleLinkTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditLinkText(event.target.value);
    if (errors.linkText) setErrors((prev) => ({ ...prev, linkText: undefined }));
  }

  // Toggle edit mode
  function handleEditClick() {
    setIsEditing(!isEditing);
  }

  // Validate edited values with Zod and then call parent onEdit
  function handleEdit() {
    // ✅ Validate edited values before calling parent
    const result = linkSchema.safeParse({
      linkText: editLinkText,
      linkUrl: editLinkUrl,
    });

    if (!result.success) {
      const fieldErrors: { linkText?: string; linkUrl?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path === "linkText" || path === "linkUrl") {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return; // ❌ Don't call onEdit if validation fails
    }

    setErrors({});

    onEdit?.(link.id, {
      linkUrl: result.data.linkUrl,
      linkText: result.data.linkText,
    });
    handleEditClick();
  }

  // Call parent onDelete handler if provided
  function handleDelete() {
    onDelete?.(link.id);
  }

  if (!isEditable) {
    return (
      <a
        href={link.link_url.startsWith("http") ? link.link_url : `https://${link.link_url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
            {link.link_text}
          </div>
          <div className="text-gray-500 text-sm mt-1 truncate">{link.link_url}</div>
        </div>
      </a>
    );
  }

  return (
    <div>
      {isEditing ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Link Name
            </span>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.linkText
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-teal-500"
              }`}
              value={editLinkText}
              onChange={handleLinkTextChange}
            />
            {errors.linkText && (
              <p className="text-red-500 text-sm mt-1">{errors.linkText}</p>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Link URL
            </span>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.linkUrl
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-teal-500"
              }`}
              value={editLinkUrl}
              onChange={handleLinkUrlChange}
            />
            {errors.linkUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.linkUrl}</p>
            )}
          </label>
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium"
              onClick={handleEdit}
            >
              Save
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium"
              onClick={handleEditClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800">{link.link_text}</div>
            <div className="text-gray-500 text-sm mt-1 truncate">
              {link.link_url}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
              onClick={handleEditClick}
              aria-label="Edit link"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              onClick={handleDelete}
              aria-label="Delete link"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkItem;
