"use client";

import {
  UserButton,
} from "@clerk/nextjs";

interface NavbarProps {
  activeTab: string;
}

export default function Navbar({
  activeTab,
}: NavbarProps) {
  function getTitle() {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";

      case "notes":
        return "Notes";

      case "chat":
        return "AI Chat";

      case "flashcards":
        return "Flashcards";

      case "analytics":
        return "Analytics";

      case "settings":
        return "Settings";

      default:
        return "Dashboard";
    }
  }

  return (
    <header className="h-16 border-b border-zinc-800 bg-black flex items-center justify-between px-6">
      <div>
        <h2 className="text-white text-2xl font-bold">
          {getTitle()}
        </h2>

        <p className="text-zinc-500 text-sm">
          Manage your AI knowledge
          workspace
        </p>
      </div>

      <div className="flex items-center gap-4">
        <UserButton
      
        />
      </div>
    </header>
  );
}