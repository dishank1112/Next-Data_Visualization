// components/auth/Logout.tsx
"use client";

import { signOut } from "firebase/auth";
import {auth } from ''
export default function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
