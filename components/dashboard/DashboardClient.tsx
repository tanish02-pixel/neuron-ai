"use client";

import { useState } from "react";

import StatsCard from "./StatsCard";
import UploadBox from "./UploadBox";
import NotesList from "./NotesList";
import AIChat from "./AIChat";
import Flashcards from "./Flashcards";
import Analytics from "./Analytics";
import Settings from "./Settings";
import PDFViewer from "./PDFViewer";
import { deleteNote } from "@/actions/note.actions";
import toast from "react-hot-toast";

interface DashboardClientProps {
  initialNotes: {
    id: string;
    name: string;
    url: string;
  }[];

  activeTab: string;

  selectedNote: {
    id: string;
    url: string;
  } | null;

  setSelectedNote: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        url: string;
      } | null
    >
  >;

  totalChats: number;

  totalFlashcards: number;
}

export default function DashboardClient({
  initialNotes,
  activeTab,
  selectedNote,
  setSelectedNote,
  totalChats,
  totalFlashcards,
}: DashboardClientProps) {
  const [notes, setNotes] =
    useState(initialNotes);

const handleDelete = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this PDF?"
  );

  if (!confirmed) return;

  try {
    await deleteNote(id);

    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );

    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }

    toast.success("PDF deleted successfully");
  } catch {
    toast.error("Failed to delete PDF");
  }
};

  return (
    <div className="relative mt-10">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10">
        {/* Dashboard */}
        {activeTab ===
          "dashboard" && (
          <>
            {/* Hero */}
            <div className="relative overflow-hidden rounded-[40px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/90 backdrop-blur-2xl p-10 shadow-[0_0_80px_rgba(168,85,247,0.12)]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[120px] rounded-full" />

              <div className="relative z-10">
                <p className="text-cyan-400 font-medium tracking-wide">
                  AI Workspace
                </p>

                <h1 className="text-5xl xl:text-6xl font-black mt-4 leading-[1.05] tracking-[-0.04em]">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                    Neuron AI
                  </span>
                </h1>

                <p className="text-zinc-400 text-lg mt-6 max-w-2xl leading-relaxed">
                  Upload PDFs, interact
                  with documents using AI,
                  generate flashcards, and
                  build your intelligent
                  second brain.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="group hover:-translate-y-2 transition-all duration-500">
                <div className="bg-zinc-950/70 backdrop-blur-2xl border border-zinc-800 rounded-[32px] p-1 hover:border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
                  <StatsCard
                    title="Total Notes"
                    value={notes.length.toString()}
                  />
                </div>
              </div>

              <div className="group hover:-translate-y-2 transition-all duration-500">
                <div className="bg-zinc-950/70 backdrop-blur-2xl border border-zinc-800 rounded-[32px] p-1 hover:border-fuchsia-500/40 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
                  <StatsCard
                    title="AI Chats"
                    value={totalChats.toString()}
                  />
                </div>
              </div>

              <div className="group hover:-translate-y-2 transition-all duration-500">
                <div className="bg-zinc-950/70 backdrop-blur-2xl border border-zinc-800 rounded-[32px] p-1 hover:border-purple-500/40 shadow-[0_0_40px_rgba(147,51,234,0.08)]">
                  <StatsCard
                    title="Flashcards"
                    value={totalFlashcards.toString()}
                  />
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="mt-8 relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />

              <div className="relative z-10">
                <UploadBox
                  setNotes={setNotes}
                />
              </div>
            </div>
          </>
        )}

        {/* Notes */}
{activeTab ===
  "notes" && (
  <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
    
    {/* Notes Library */}
    <div className="relative w-full max-w-full overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
      
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

      <div className="relative z-10 w-full overflow-hidden">
        <NotesList
  notes={notes}
  selectedNote={selectedNote}
  setSelectedNote={setSelectedNote}
  onDelete={handleDelete}
/>
      </div>
    </div>

    {/* PDF Viewer */}
    <div
      className={`transition-all duration-500 w-full max-w-full overflow-hidden ${
        selectedNote
          ? "opacity-100 translate-y-0"
          : "opacity-0 h-0 overflow-hidden"
      }`}
    >
      {selectedNote && (
        <div className="relative w-full max-w-full overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-2 xl:p-4 shadow-[0_0_60px_rgba(6,182,212,0.08)]">
          
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />

          <div className="relative z-10 w-full overflow-hidden">
            <PDFViewer
              pdfUrl={
                selectedNote.url
              }
            />
          </div>
        </div>
      )}
    </div>
  </div>
)}
        {/* Chat */}
        {activeTab === "chat" && (
          <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

            <div className="relative z-10">
              <AIChat
                selectedNote={
                  selectedNote?.id ||
                  null
                }
              />
            </div>
          </div>
        )}

        {/* Flashcards */}
        {activeTab ===
          "flashcards" && (
          <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

            <div className="relative z-10">
              <Flashcards
                selectedNote={
                  selectedNote?.id ||
                  null
                }
              />
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab ===
          "analytics" && (
          <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

            <div className="relative z-10">
              <Analytics
                totalNotes={
                  notes.length
                }
                totalChats={
                  totalChats
                }
                totalFlashcards={
                  totalFlashcards
                }
              />
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab ===
          "settings" && (
          <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

            <div className="relative z-10">
              <Settings />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800/60 py-8 px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div>
            <h3 className="text-white font-bold text-lg">
              Neuron AI
            </h3>

            <p className="text-zinc-500 text-sm mt-1">
              Your AI-powered second
              brain
            </p>
          </div>

          {/* Center */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              "dashboard",
              "notes",
              "chat",
              "flashcards",
              "analytics",
              "settings",
            ].map((item) => {
              const isActive =
                activeTab === item;

              return (
                <div
                  key={item}
                  className={`relative group px-[1px] py-[1px] rounded-2xl transition-all duration-500
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 shadow-[0_0_35px_rgba(168,85,247,0.45)]"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`relative z-10 px-3 py-2 rounded-2xl backdrop-blur-xl transition-all duration-500
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-zinc-950/90 text-zinc-500 group-hover:text-white"
                    }`}
                  >
                    {item === "chat"
                      ? "AI Chat"
                      : item.charAt(
                          0
                        ).toUpperCase() +
                        item.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right */}
          <div className="text-zinc-500 text-sm">
            Designed & Developed by{" "}
            <span className="text-white font-medium">
              Tanish Singh
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}