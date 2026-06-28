"use client";

import {
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
}

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/90 backdrop-blur-2xl p-7 hover:-translate-y-2 hover:border-fuchsia-500/30 transition-all duration-500 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Top Glow */}
      <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-fuchsia-500/30 transition-all duration-300">
            <Sparkles
              size={20}
              className="text-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            <TrendingUp size={14} />
            Active
          </div>
        </div>

        {/* Title */}
        <h3 className="text-zinc-500 text-sm font-medium tracking-wide uppercase mt-8">
          {title}
        </h3>

        {/* Value */}
        <p className="text-5xl font-black text-white mt-4 tracking-tight leading-none">
          {value}
        </p>

        {/* Bottom Accent */}
        <div className="mt-8 h-[2px] w-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 opacity-60 group-hover:opacity-100 transition-all duration-500" />
      </div>
    </div>
  );
}