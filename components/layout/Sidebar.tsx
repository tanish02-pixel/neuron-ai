"use client";

import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Brain,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;

  setActiveTab: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  return (
    <aside className="relative w-72 min-h-screen border-r border-zinc-800/60 bg-zinc-950/70 backdrop-blur-2xl p-6 sticky top-0 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <Sparkles
              size={22}
              className="text-black"
            />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Neuron AI
            </h1>

            <p className="text-zinc-500 text-sm mt-1">
              AI Workspace
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <SidebarItem
            icon={
              <LayoutDashboard
                size={20}
              />
            }
            label="Dashboard"
            active={
              activeTab ===
              "dashboard"
            }
            onClick={() =>
              setActiveTab(
                "dashboard"
              )
            }
          />

          <SidebarItem
            icon={
              <FileText size={20} />
            }
            label="Notes"
            active={
              activeTab === "notes"
            }
            onClick={() =>
              setActiveTab("notes")
            }
          />

          <SidebarItem
            icon={
              <MessageSquare
                size={20}
              />
            }
            label="AI Chat"
            active={
              activeTab === "chat"
            }
            onClick={() =>
              setActiveTab("chat")
            }
          />

          <SidebarItem
            icon={<Brain size={20} />}
            label="Flashcards"
            active={
              activeTab ===
              "flashcards"
            }
            onClick={() =>
              setActiveTab(
                "flashcards"
              )
            }
          />

          <SidebarItem
            icon={
              <BarChart3 size={20} />
            }
            label="Analytics"
            active={
              activeTab ===
              "analytics"
            }
            onClick={() =>
              setActiveTab(
                "analytics"
              )
            }
          />

          <SidebarItem
            icon={
              <Settings size={20} />
            }
            label="Settings"
            active={
              activeTab ===
              "settings"
            }
            onClick={() =>
              setActiveTab(
                "settings"
              )
            }
          />
        </nav>

        {/* Bottom Card */}
        <div className="mt-14 relative overflow-hidden rounded-[28px] border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-2xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />

          <div className="relative z-10">
            <p className="text-cyan-400 text-sm font-medium">
              AI Assistant
            </p>

            <h3 className="text-white font-bold text-lg mt-2">
              Upgrade Your Learning
            </h3>

            <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
              Chat smarter with PDFs and
              build your AI-powered second
              brain.
            </p>

          <button
  onClick={() =>
    setActiveTab("chat")
  }
  className="mt-5 w-full bg-white text-black py-3 rounded-2xl font-semibold hover:bg-zinc-200 hover:scale-[1.02] transition-all duration-300"
>
  Explore AI
</button>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;

  label: string;

  active?: boolean;

  onClick: () => void;
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden
      ${
        active
          ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black shadow-[0_0_30px_rgba(168,85,247,0.35)]"
          : "text-zinc-400 hover:bg-zinc-900/80 hover:text-white"
      }`}
    >
      {/* Hover Glow */}
      {!active && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-fuchsia-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      )}

      <div className="relative z-10">
        {icon}
      </div>

      <span className="relative z-10 font-medium text-[15px]">
        {label}
      </span>
    </button>
  );
}