// React context for authentication state in the client app.
// Keeps the logged-in user and token in React state AND in localStorage
// so that refresh (F5) does not log the user out.

import { createContext, useState, type ReactNode } from "react";

// Shape of the user info returned from the backend auth service
type UserInfo = {
  token: string;
  user?: {
    id: number;
    email: string;
  };
  message?: string;
} | null;

// What the context exposes to the rest of the app
type AuthContextType = {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
};

// Create the actual context object with default values
export const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  setUserInfo: () => {},
});

type Props = { children: ReactNode };

// Key used to store user info in localStorage
const STORAGE_KEY = "linktree_user_info";

function AuthContextProvider({ children }: Props) {
  // Load initial user info from localStorage (run only once on initial render)
  const [userInfo, setUserInfoState] = useState<UserInfo>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading user info from localStorage:", error);
      return null;
    }
  });

  // Wrapper function for updating userInfo state + localStorage
  const setUserInfo = (newUserInfo: UserInfo) => {
    setUserInfoState(newUserInfo);

    if (newUserInfo) {
      // Save to localStorage when user logs in or updates
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserInfo));
    } else {
      // Clear localStorage when user logs out
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = { userInfo, setUserInfo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
