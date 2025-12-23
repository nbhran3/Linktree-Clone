// Public linktree page - what visitors see when they open a user's linktree URL.
// This does NOT require authentication and only performs read-only API calls.

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

type LinkType = {
  id: number;
  link_url: string;
  link_text: string;
};

// Shape of the response returned by the public backend
type PublicLinktreeData = {
  linktreeSuffix: string;
  links: LinkType[];
};

function PublicLinktree() {
  const { suffix } = useParams<{ suffix: string }>();
  const [linktree, setLinktree] = useState<PublicLinktreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // When suffix changes, load the public linktree from the public service
  useEffect(() => {
    async function fetchPublicLinktree() {
      if (!suffix) {
        setError("No linktree suffix provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:3000/public/linktrees/${suffix}`
        );
        setLinktree(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load linktree";
        setError(errorMessage);
        setLinktree(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicLinktree();
  }, [suffix]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-animated opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90 pointer-events-none" />
        <div className="relative flex justify-center items-center min-h-screen">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-animated opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90 pointer-events-none" />
        <div className="relative flex justify-center items-center min-h-screen">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <div className="text-red-600 text-xl font-semibold mb-2">
              {error}
            </div>
            <div className="text-gray-500 text-sm">
              The linktree "{suffix}" could not be found
            </div>
            <Link
              to="/homepage"
              className="inline-block mt-6 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!linktree) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-animated opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90 pointer-events-none" />
        <div className="relative flex justify-center items-center min-h-screen">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg text-center max-w-md mx-4">
            <div className="text-gray-600 text-xl font-semibold mb-2">
              Linktree not found
            </div>
            <div className="text-gray-500 text-sm">
              Suffix: {suffix || "N/A"}
            </div>
            <Link
              to="/homepage"
              className="inline-block mt-6 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
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
              to="/homepage"
              className="text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors"
            >
              Linktree
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-lg">
              {/* Profile section */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  @{linktree.linktreeSuffix}
                </h1>
              </div>

              {/* Links */}
              {linktree.links.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg">No links yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {linktree.links.map((link) => (
                    <a
                      key={link.id}
                      href={
                        link.link_url.startsWith("http")
                          ? link.link_url
                          : `https://${link.link_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                    >
                      <div className="text-center">
                        <div className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                          {link.link_text}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-400 text-sm">
                  Create your own linktree at{" "}
                  <Link
                    to="/register"
                    className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                  >
                    Linktree
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PublicLinktree;
