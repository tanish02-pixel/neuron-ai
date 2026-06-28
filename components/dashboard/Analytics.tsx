"use client";

import {
  FileText,
  Brain,
  MessageSquare,
  Clock3,
  TrendingUp,
  Sparkles,
  Activity,
} from "lucide-react";

interface AnalyticsProps {
  totalNotes: number;
  totalChats: number;
  totalFlashcards: number;
}

export default function Analytics({
  totalNotes,
  totalChats,
  totalFlashcards,
}: AnalyticsProps) {
  const productivityScore = Math.min(
    100,
    totalNotes * 10 +
      totalChats * 2 +
      totalFlashcards
  );

  const stats = [
    {
      title: "Total Notes",
      value: totalNotes,
      icon: <FileText size={24} />,
      glow:
        "shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    },
    {
      title: "AI Chats",
      value: totalChats,
      icon: (
        <MessageSquare size={24} />
      ),
      glow:
        "shadow-[0_0_40px_rgba(168,85,247,0.15)]",
    },
    {
      title: "Flashcards",
      value: totalFlashcards,
      icon: <Brain size={24} />,
      glow:
        "shadow-[0_0_40px_rgba(147,51,234,0.15)]",
    },
    {
      title: "Productivity",
      value: `${productivityScore}%`,
      icon: <TrendingUp size={24} />,
      glow:
        "shadow-[0_0_40px_rgba(34,197,94,0.15)]",
    },
  ];

  return (
    <div className="relative mt-10">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.35)]">
              <Activity
                size={26}
                className="text-black"
              />
            </div>

            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                Analytics Dashboard
              </h2>

              <p className="text-zinc-500 mt-2 text-lg">
                AI-powered learning
                insights and productivity
                tracking
              </p>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-7 hover:-translate-y-2 hover:border-fuchsia-500/30 transition-all duration-500 ${stat.glow}`}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white group-hover:border-fuchsia-500/30 transition-all duration-300">
                    {stat.icon}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                    LIVE
                  </span>
                </div>

                <h3 className="text-zinc-500 text-sm mt-8">
                  {stat.title}
                </h3>

                <p className="text-5xl font-black text-white mt-3 tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity + Insights */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-8">
                Weekly Learning Activity
              </h3>

              <div className="space-y-6">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ].map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <span className="w-24 text-zinc-400">
                      {day}
                    </span>

                    <div className="flex-1 h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        style={{
                          width: `${
                            40 +
                            index * 12
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-cyan-400" />

                <h3 className="text-2xl font-bold text-white">
                  AI Insights
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  {
                    title:
                      "Study Activity",
                    desc: `You uploaded ${totalNotes} learning documents.`,
                  },
                  {
                    title: "AI Usage",
                    desc: `You asked ${totalChats} AI questions.`,
                  },
                  {
                    title:
                      "Revision Strength",
                    desc: `Generated ${totalFlashcards} smart flashcards.`,
                  },
                  {
                    title:
                      "AI Suggestion",
                    desc: "Continue revising daily to improve productivity.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-5 hover:border-fuchsia-500/30 transition-all duration-300"
                  >
                    <p className="text-white font-semibold">
                      {item.title}
                    </p>

                    <p className="text-zinc-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Study Insights */}
        <div className="mt-10 relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Clock3 className="text-cyan-400" />

              <h3 className="text-2xl font-bold text-white">
                Estimated Study Insights
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title:
                    "Estimated Study Hours",
                  value: `${(
                    totalChats * 0.5 +
                    totalFlashcards *
                      0.1
                  ).toFixed(1)}h`,
                },
                {
                  title:
                    "PDFs Processed",
                  value: totalNotes,
                },
                {
                  title:
                    "AI Learning Score",
                  value: `${productivityScore}%`,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-zinc-950/80 border border-zinc-800 rounded-[28px] p-6 hover:border-fuchsia-500/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-zinc-500 text-sm">
                    {item.title}
                  </p>

                  <h4 className="text-5xl font-black text-white mt-5 tracking-tight">
                    {item.value}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}