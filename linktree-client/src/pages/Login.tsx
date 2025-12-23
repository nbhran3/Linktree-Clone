// Login page - handles user authentication flow on the client side.
// Validates input with Zod before calling the backend, shows field-level errors,
// and saves the logged-in user to AuthContext (and localStorage via context).

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";
import { loginSchema } from "../validators/auth-schema";

function Login() {
  const navigate = useNavigate();
  // Local state for the login form
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  // Field-level validation errors populated from Zod
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Get setter from AuthContext to persist user info globally
  const { setUserInfo } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Update email field and clear its error when user types
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setLoginInfo((prevValue) => ({
      password: prevValue.password,
      email: newValue,
    }));
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  }

  // Update password field and clear its error when user types
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setLoginInfo((prevValue) => ({
      password: newValue,
      email: prevValue.email,
    }));
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
  }

  // Validate the form with Zod before hitting the API
  async function handleCheckLoginInfo() {
    // ✅ Validate BEFORE making API call
    const result = loginSchema.safeParse(loginInfo);

    if (!result.success) {
      // Extract field-specific errors
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path === "email" || path === "password") {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      // Optional: clear any previous message instead of showing a generic one
      setMessage(null);
      return; // ✅ Stop here - don't call API
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      const respond = await axios.post(`${API_URL}/auth/login`, {
        email: result.data.email,
        password: result.data.password,
      });

      setUserInfo(respond.data);
      setMessage({
        text: respond.data.message || "Login successful",
        type: "success",
      });
      setTimeout(() => {
        navigate("/userPage");
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/homepage"
          className="text-3xl font-extrabold text-gray-800 hover:text-teal-600 transition-colors"
        >
          Linktree
        </Link>
      </div>
      <div className="absolute inset-0 bg-animated opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90 pointer-events-none" />

      <div className="relative w-full max-w-xl px-6">
        <div className="border border-gray-300 rounded-lg p-6 bg-white/90 backdrop-blur shadow-sm">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
          </div>
          {message && (
            <Message
              message={message.text}
              type={message.type}
              onClose={() => setMessage(null)}
            />
          )}
          <div className="space-y-4">
            <label className="block">
              Email:
              <input
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
                name="email"
                placeholder="Enter Email"
                value={loginInfo.email}
                onChange={handleEmailChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </label>
            <label className="block">
              Password:
              <input
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
                type="password"
                name="password"
                placeholder="Enter Password"
                value={loginInfo.password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </label>
            <button
              className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-md"
              onClick={handleCheckLoginInfo}
            >
              Login
            </button>
            <p className="text-center text-gray-600 mt-4">
              Don't have an account yet?{" "}
              <Link
                to="/Register"
                className="text-teal-500 hover:text-teal-600 font-medium"
              >
                Create an account!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
