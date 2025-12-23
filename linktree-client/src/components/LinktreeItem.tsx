// Presentational component for a single linktree on the LinktreePage.
// Renders the header, share URL, list of LinkItem components, and "Add link" modal.

import LinkItem from "./LinkItem";

type LinktreeData = {
  id: number;
  linktree_suffix: string;
};

type LinkData = {
  id: number;
  link_url: string;
  link_text: string;
};

// Props expected from the parent LinktreePage container
type LinktreeProps = {
  linktree: LinktreeData;
  link: LinkData[];
  onDelete: (linkId: number) => void;
  onEdit: (
    linkId: number,
    linkData: { linkText: string; linkUrl: string }
  ) => void;
  isAddingLink: boolean;
  onAddClick: () => void;
  onCancelAdd: () => void;
  onSubmitNewLink: () => void;
  newLink: { linkUrl: string; linkText: string };
  onLinkUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLinkTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  linkErrors?: { linkText?: string; linkUrl?: string };
};

function LinktreeItem({
  linktree,
  link,
  onDelete,
  onEdit,
  isAddingLink,
  onAddClick,
  onCancelAdd,
  onSubmitNewLink,
  newLink,
  onLinkUrlChange,
  onLinkTextChange,
  linkErrors = {},
}: LinktreeProps) {
  return (
    <>
      <div className="w-full max-w-xl">
        <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-lg">
          {/* Header with suffix */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-teal-50 rounded-full mb-3">
              <span className="text-teal-600 font-medium text-sm">
                Your Linktree
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              @{linktree.linktree_suffix}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Share this page:{" "}
              <a
                href={`/linktree/${linktree.linktree_suffix}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 font-medium hover:text-teal-700 hover:underline transition-colors"
              >
                /linktree/{linktree.linktree_suffix}
              </a>
            </p>
          </div>

          {/* Add Link Button */}
          <button
            className="w-full mb-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all font-semibold shadow-md hover:shadow-lg"
            onClick={onAddClick}
          >
            + Add New Link
          </button>

          {/* Links List */}
          {link.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No links yet</p>
              <p className="text-sm mt-1">Add your first link to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {link.map((linkItem) => (
                <div
                  key={linkItem.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
                >
                  <LinkItem
                    link={linkItem}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Link Modal */}
      {isAddingLink && (
        <div
          className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          onClick={onCancelAdd}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Add New Link
            </h3>
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Link Name
                </span>
                <input
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    linkErrors.linkText 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-teal-500"
                  }`}
                  value={newLink.linkText}
                  onChange={onLinkTextChange}
                  placeholder="e.g. My Portfolio"
                />
                {linkErrors.linkText && (
                  <p className="text-red-500 text-sm mt-1">{linkErrors.linkText}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">
                  Link URL
                </span>
                <input
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    linkErrors.linkUrl 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-teal-500"
                  }`}
                  value={newLink.linkUrl}
                  onChange={onLinkUrlChange}
                  placeholder="https://example.com"
                />
                {linkErrors.linkUrl && (
                  <p className="text-red-500 text-sm mt-1">{linkErrors.linkUrl}</p>
                )}
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 px-5 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-md"
                  onClick={onSubmitNewLink}
                >
                  Add Link
                </button>
                <button
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  onClick={onCancelAdd}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LinktreeItem;
