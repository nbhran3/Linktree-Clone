// Reusable message banner used to show success/error notifications.
// Automatically disappears after a short delay with a fade-out animation.

import { useEffect, useState } from "react";

type MessageProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

function Message({ message, type, onClose }: MessageProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Tailwind classes depending on message type
  const bgColor =
    type === "success" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";

  useEffect(() => {
    // Show message, then start fade-out, then call onClose to remove it
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade-out animation to complete
    }, 3000); // Show message for 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${bgColor} ${textColor} border-l-4 p-4 rounded-md mb-4 flex items-center ${
        isFadingOut ? "animate-fadeOut" : "animate-slideDown"
      }`}
      role="alert"
    >
      <div className="flex items-center">
        <span className={`${iconColor} font-semibold mr-2`}>
          {type === "success" ? "✓" : "✕"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Message;

