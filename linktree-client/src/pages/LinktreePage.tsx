// Page for managing a single linktree's links (add/edit/delete).
// Requires authentication; uses Zod to validate link forms before hitting the API.

import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import LinktreeItem from "../components/LinktreeItem";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Message from "../components/Message";
import { linkSchema } from "../validators/linktree-schema";

// Shape of a link as returned by the backend
type LinkType = {
  id: number;
  link_url: string;
  link_text: string;
  name: string;
};

// Shape of the current linktree
type Linktree = {
  id: number;
  linktree_suffix: string;
};

function LinktreePage() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  // Links inside this linktree
  const [links, setLinks] = useState<LinkType[]>([]);
  // Metadata about the current linktree
  const [linktree, setLinktree] = useState<Linktree>();
  // Controls "Add new link" modal visibility
  const [isClicked, setIsClicked] = useState(false);
  // Controlled inputs for new link
  const [newLink, setNewLink] = useState({ linkUrl: "", linkText: "" });
  // Mobile menu state
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  // Global message (success/error)
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  // Field-level Zod errors for new link form
  const [linkErrors, setLinkErrors] = useState<{
    linkText?: string;
    linkUrl?: string;
  }>({});

  // If user is not logged in, show a simple message
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">
          Please log in to view this page.
        </div>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL;

  // Axios instance with JWT in Authorization header
  const authAxios = axios.create({
    baseURL: `${API_URL}/linktrees`,
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  });

  // Load linktree + its links when the id changes
  useEffect(() => {
    async function fetchLinks() {
      const respond = await authAxios.get(`/${id}`);
      setLinks(respond.data.links);
      setLinktree({
        id: respond.data.id,
        linktree_suffix: respond.data.linktreeSuffix,
      });
    }

    fetchLinks();
  }, [id]);

  // Handle typing into "link URL" field in the add-link modal
  function handleLinkUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setNewLink((prevValue) => ({
      linkUrl: newValue,
      linkText: prevValue.linkText,
    }));
    if (linkErrors.linkUrl)
      setLinkErrors((prev) => ({ ...prev, linkUrl: undefined }));
  }

  // Handle typing into "link text" field in the add-link modal
  function handleLinkTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setNewLink((prevValue) => ({
      linkUrl: prevValue.linkUrl,
      linkText: newValue,
    }));
    if (linkErrors.linkText)
      setLinkErrors((prev) => ({ ...prev, linkText: undefined }));
  }

  // Validate and submit the "add new link" form
  async function handleSubmitNewLink() {
    // ✅ Validate BEFORE making API call
    const result = linkSchema.safeParse({
      linkText: newLink.linkText,
      linkUrl: newLink.linkUrl,
    });

    if (!result.success) {
      // Extract field-specific errors
      const fieldErrors: { linkText?: string; linkUrl?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path === "linkText" || path === "linkUrl") {
          fieldErrors[path] = issue.message;
        }
      });
      setLinkErrors(fieldErrors);

      // Show general error message
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      setMessage({
        text: errorMessage,
        type: "error",
      });
      return; // ✅ Stop here - don't call API
    }

    // Clear errors if validation passes
    setLinkErrors({});

    try {
      const respond = await authAxios.post(`/${id}/links`, {
        linkText: result.data.linkText,
        linkUrl: result.data.linkUrl,
      });
      setLinks(respond.data.links);
      setNewLink({ linkUrl: "", linkText: "" });
      setIsClicked(!isClicked);
      setMessage({
        text: respond.data.message || "Link added successfully",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add link. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  // Delete a link from this linktree
  async function handleDeleteLink(linkId: number) {
    try {
      const respond = await authAxios.delete(`/${id}/links/${linkId}`);
      setLinks(respond.data.links);
      setMessage({
        text: respond.data.message || "Link deleted successfully",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete link. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  // Validate and submit an "edit link" operation coming from LinkItem
  async function handleEditLink(
    linkId: number,
    linkData: { linkUrl: string; linkText: string }
  ) {
    // ✅ Validate BEFORE making API call
    const result = linkSchema.safeParse(linkData);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      setMessage({
        text: errorMessage,
        type: "error",
      });
      return; // ✅ Stop here - don't call API
    }

    try {
      const respond = await authAxios.patch(`${id}/links/${linkId}`, {
        linkText: result.data.linkText,
        linkUrl: result.data.linkUrl,
      });
      setLinks(respond.data.links);
      setMessage({
        text: respond.data.message || "Link updated successfully",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update link. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  // Toggle "add link" modal
  function handleIsClicked() {
    setIsClicked(!isClicked);
  }

  // Toggle header dropdown menu
  function handleIsMenuClicked() {
    setIsMenuClicked(!isMenuClicked);
  }

  // Clear auth state and go back to login
  function handleLogout() {
    setUserInfo(null);
    navigate("/login");
  }

  // Navigate back to the list of linktrees
  function handleNavigateToLinktrees() {
    navigate("/userPage");
  }

  if (!linktree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-animated opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90 pointer-events-none" />

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors"
            >
              Linktree
            </Link>
            <div className="relative">
              <button
                className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-md"
                onClick={handleIsMenuClicked}
                aria-label="Toggle menu"
              >
                {isMenuClicked ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              {isMenuClicked && (
                <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[180px] animate-slideDown">
                  <button
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={handleNavigateToLinktrees}
                  >
                    My Linktrees
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex justify-center px-6 py-8">
          <div className="w-full max-w-xl">
            {message && (
              <div className="mb-6">
                <Message
                  message={message.text}
                  type={message.type}
                  onClose={() => setMessage(null)}
                />
              </div>
            )}
            <LinktreeItem
              linktree={linktree}
              link={links}
              onDelete={handleDeleteLink}
              onEdit={handleEditLink}
              isAddingLink={isClicked}
              onAddClick={handleIsClicked}
              onCancelAdd={handleIsClicked}
              onSubmitNewLink={handleSubmitNewLink}
              newLink={newLink}
              onLinkUrlChange={handleLinkUrlChange}
              onLinkTextChange={handleLinkTextChange}
              linkErrors={linkErrors}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LinktreePage;
