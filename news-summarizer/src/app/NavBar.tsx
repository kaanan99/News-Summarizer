"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState("");

  const router = useRouter();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "long" });
      const date = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDateTime(`${day} ${date} • ${time}`);
    };

    updateDateTime(); // Set initially
    const timer = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <nav className="bg-white-100 border-b border-gray-300 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div
          onClick={() => router.push("/")}
          className="text-lg font-bold text-gray-800">
          Kaanan & Kenny's Daily Newsletter
        </div>

        <div className="flex items-center space-x-6">
          <span
            onClick={() => router.push("/todays-briefing")}
            className="text-sm font-medium text-gray-700 hover:underline cursor-pointer"
          >
            Today's News
          </span>
          <span
            onClick={() => router.push("/about")}
            className="text-sm font-medium text-gray-700 hover:underline cursor-pointer"
          >
            About
          </span>
          <span className="text-sm font-medium text-gray-400">
            {currentDateTime}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
