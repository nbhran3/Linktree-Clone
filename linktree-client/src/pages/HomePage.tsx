// Marketing-style landing page shown at /.
// Encourages users to register or log in and explains the core features.

import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-animated opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90 pointer-events-none" />

      <div className="relative flex flex-col min-h-screen">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors"
            >
              Linktree
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Register
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Create your own link hub and share it with the world
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Add all your important links in one place. Customize, manage, and
              share your public linktree page easily.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium w-full sm:w-auto text-center shadow-md"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto text-center bg-white/80 backdrop-blur"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 pb-16">
            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
              <div className="border border-gray-200 rounded-lg p-5 bg-white/90 backdrop-blur shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Manage Links
                </h3>
                <p className="text-gray-600">
                  Add, edit, and delete your links from one place with an easy
                  UI.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5 bg-white/90 backdrop-blur shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Public Page
                </h3>
                <p className="text-gray-600">
                  Share your public linktree URL so anyone can access your
                  links.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
