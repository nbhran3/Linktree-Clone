// Simple 404 page used as a catch-all route when no other page matches.

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center px-6 min-h-screen items-center">
      <div className="w-full max-w-xl">
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              The page you are looking for does not exist.
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              Return to Login Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
