// User dashboard page - shows all linktrees owned by the logged-in user.
// Allows creating and deleting linktrees, with frontend validation using Zod.

import { useState, useEffect, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";
import { createLinktreeSchema } from "../validators/linktree-schema";

// Shape of a linktree as returned from the backend
type LinktreeData = {
  id: number;
  linktree_suffix: string;
};

function UserPage() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(AuthContext);
  // List of linktrees for this user
  const [linktrees, setLinktrees] = useState<LinktreeData[]>([]);
  // Controls "Create new linktree" form visibility
  const [isClicked, setIsClicked] = useState(false);
  // Controlled input for the new linktree suffix
  const [newLinktree, setNewlinktree] = useState("");
  // Tracks which linktree is being confirmed for deletion
  const [linktreeToDelete, setLinktreeToDelete] = useState<number | null>(null);
  // Global message (success/error)
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  // Zod validation error for the linktree suffix input
  const [linktreeError, setLinktreeError] = useState<string | null>(null);

  // If user is not logged in, redirect to login
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  const API_URL = import.meta.env.VITE_API_URL;

  // Axios instance that includes the JWT in Authorization header
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  });

  // Load all linktrees for this user on mount
  useEffect(() => {
    async function fetchLinktrees() {
      const respond = await authAxios.get("/linktrees");
      setLinktrees(respond.data.linktrees);
    }
    fetchLinktrees();
  }, []);

  // Handle typing into the new linktree suffix input
  function handleNewLinktree(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setNewlinktree(newValue);
    // Clear error when user types
    if (linktreeError) setLinktreeError(null);
  }

  // Validate and submit the "create linktree" form
  async function handleSubmitNewLinktree() {
    // ✅ Validate BEFORE making API call
    const result = createLinktreeSchema.safeParse({
      linktreeSuffix: newLinktree,
    });

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      setLinktreeError(errorMessage);
      setMessage({
        text: errorMessage,
        type: "error",
      });
      return; // ✅ Stop here - don't call API
    }

    // Clear error if validation passes
    setLinktreeError(null);

    try {
      const respond = await authAxios.post("/linktrees", {
        linktreeSuffix: result.data.linktreeSuffix,
      });
      setLinktrees((prev) => [
        ...prev,
        { id: respond.data.id, linktree_suffix: respond.data.linktreeSuffix },
      ]);
      setNewlinktree("");
      setIsClicked(false);
      setMessage({
        text: respond.data.message || "Linktree created successfully",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create linktree. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  // Delete a linktree after confirmation
  async function handleDeleteLinktree(id: number) {
    try {
      const respond = await authAxios.delete(`/linktrees/${id}`);
      setLinktrees((prev) => prev.filter((linktree) => linktree.id !== id));
      setLinktreeToDelete(null);
      setMessage({
        text: respond.data?.message || "Linktree deleted successfully",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete linktree. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
      setLinktreeToDelete(null);
    }
  }

  // Toggle the "create new linktree" form
  function handleIsClicked() {
    setIsClicked(!isClicked);
  }

  // Clear auth state and send user back to login
  function handleLogout() {
    setUserInfo(null);
    navigate("/login");
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
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md font-medium"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Linktrees
                </h1>
                <p className="text-gray-500">
                  Manage all your linktree pages in one place
                </p>
              </div>

              {message && (
                <div className="mb-6">
                  <Message
                    message={message.text}
                    type={message.type}
                    onClose={() => setMessage(null)}
                  />
                </div>
              )}

              {isClicked ? (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Create New Linktree
                  </h3>
                  <label className="block mb-4">
                    <span className="text-sm font-medium text-gray-700 mb-1 block">
                      Linktree Suffix
                    </span>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                        @
                      </span>
                      <input
                        className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                          linktreeError
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        }`}
                        placeholder="your-unique-name"
                        value={newLinktree}
                        onChange={handleNewLinktree}
                      />
                    </div>
                    {linktreeError && (
                      <p className="text-red-500 text-sm mt-1">
                        {linktreeError}
                      </p>
                    )}
                  </label>
                  <div className="flex gap-3 justify-end">
                    <button
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium"
                      onClick={handleIsClicked}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium shadow-md"
                      onClick={handleSubmitNewLinktree}
                    >
                      Create
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full mb-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all font-semibold shadow-md hover:shadow-lg"
                  onClick={handleIsClicked}
                >
                  + Add New Linktree
                </button>
              )}

              {linktrees.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">No linktrees yet</p>
                  <p className="text-sm mt-1">
                    Create your first linktree to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {linktrees.map((linktree) => (
                    <div
                      key={linktree.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group"
                    >
                      {linktreeToDelete === linktree.id ? (
                        <div className="space-y-4">
                          <p className="text-gray-700 font-medium text-center">
                            Delete{" "}
                            <span className="text-teal-600">
                              @{linktree.linktree_suffix}
                            </span>
                            ?
                          </p>
                          <div className="flex gap-3 justify-center">
                            <button
                              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
                              onClick={() => handleDeleteLinktree(linktree.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium"
                              onClick={() => setLinktreeToDelete(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <Link
                            to={`/linktrees/${linktree.id}`}
                            className="flex-1 min-w-0"
                          >
                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                              @{linktree.linktree_suffix}
                            </h2>
                          </Link>
                          <button
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                            onClick={() => setLinktreeToDelete(linktree.id)}
                            aria-label="Delete linktree"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserPage;
