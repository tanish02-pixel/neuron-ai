"use client";

import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import DashboardClient from "@/components/dashboard/DashboardClient";

interface MainLayoutProps {
  notes: {
    id: string;
    name: string;
    url: string;
  }[];

  totalChats: number;

  totalFlashcards: number;
}

export default function MainLayout({
  notes,
  totalChats,
  totalFlashcards,
}: MainLayoutProps) {
  const [activeTab, setActiveTab] =
    useState("dashboard");

const [
  selectedNote,
  setSelectedNote,
] = useState<{
  id: string;
  url: string;
} | null>(null);

  return (
    <main className="flex bg-black min-h-screen text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <section className="flex-1 min-w-0 overflow-hidden">
       <Navbar activeTab={activeTab} />
<div className="relative p-8">
  {/* Glow */}
  <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[140px] rounded-full pointer-events-none" />

  <div className="relative z-10">
    {/* Dynamic Heading */}
    <div className="mb-10">
     

      <h1 className="text-5xl font-black tracking-tight leading-tight">
 

        {activeTab ===
          "notes" && (
          <>
            Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Knowledge
            </span>{" "}
            Library
          </>
        )}

        {activeTab ===
          "chat" && (
          <>
            AI Powered{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Conversations
            </span>
          </>
        )}

        {activeTab ===
          "flashcards" && (
          <>
            Smart{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Flashcards
            </span>
          </>
        )}

        {activeTab ===
          "analytics" && (
          <>
            Workspace{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Analytics
            </span>
          </>
        )}

        {activeTab ===
          "settings" && (
          <>
            Account{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Settings
            </span>
          </>
        )}
      </h1>

      <p className="text-zinc-400 text-lg mt-5 max-w-2xl leading-relaxed">
    

        {activeTab ===
          "notes" &&
          "Manage and explore all your uploaded documents in one intelligent workspace."}

        {activeTab ===
          "chat" &&
          "Ask questions from your PDFs and interact with AI instantly."}

        {activeTab ===
          "flashcards" &&
          "Generate smart revision flashcards powered by artificial intelligence."}

        {activeTab ===
          "analytics" &&
          "Track your learning activity and workspace performance."}

        {activeTab ===
          "settings" &&
          "Customize your Neuron AI workspace and preferences."}
      </p>
    </div>

    <DashboardClient
      initialNotes={notes}
      activeTab={activeTab}
      selectedNote={selectedNote}
      setSelectedNote={
        setSelectedNote
      }
      totalChats={totalChats}
      totalFlashcards={
        totalFlashcards
      }
    />
  </div>
</div>
      </section>
    </main>
  );
}