"use client";

import { FileText, Sparkles, ExternalLink, BookOpen,  Trash2, } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NotesListProps {
  notes: {
    id: string;
    name: string;
    url: string;
  }[];
  selectedNote: { id: string; url: string } | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<{ id: string; url: string } | null>>;
  onDelete: (id: string) => void;
}

export default function NotesList({
  notes,
  selectedNote,
  setSelectedNote,
  onDelete,
}: NotesListProps) {

  return (
    <div className="relative rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl">

      {/* Ambient glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Knowledge Library
            </h2>
            <p className="text-zinc-500 text-sm mt-0.5">
              {notes.length} document{notes.length !== 1 ? "s" : ""} · AI-ready workspace
            </p>
          </div>
        </div>

        {selectedNote && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active PDF
          </div>
        )}
      </div>

      {/* Carousel */}
      <div className="relative px-8">
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {notes.map((note) => {
              const isActive = selectedNote?.id === note.id;
              const shortName = note.name.replace(/\.pdf$/i, "");

              return (
                <CarouselItem key={note.id} className="pl-3 basis-[200px] md:basis-[220px]">
                  <div
                    onClick={() => setSelectedNote({ id: note.id, url: note.url })}
                    className={`group relative h-[160px] rounded-2xl border cursor-pointer transition-all duration-300 p-4 flex flex-col justify-between
                      ${isActive
                        ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-green-500/10 shadow-lg shadow-emerald-500/10"
                        : "border-white/5 bg-zinc-800/50 hover:border-white/10 hover:bg-zinc-800/80 hover:-translate-y-0.5"
                      }`}
                  >
                    {/* Active indicator line on top */}
                    {isActive && (
                      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                    )}

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                      ${isActive
                        ? "bg-gradient-to-br from-emerald-500 to-green-400 shadow-md shadow-emerald-500/30"
                        : "bg-zinc-700/80 group-hover:bg-zinc-700"
                      }`}
                    >
                      <FileText size={16} className="text-white" />
                    </div>

                    {/* Name */}
                    <div className="flex-1 mt-3">
                      <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
                        {shortName}
                      </p>
                      <p className="text-zinc-600 text-[10px] mt-1">.pdf</p>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-2">
                      {isActive ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-medium">
                          <Sparkles size={10} />
                          Active
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      )}

                     <div className="flex items-center gap-2">
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(note.id);
    }}
    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
  >
    <Trash2 size={12} />
  </button>

  <a
    href={note.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all duration-200
      ${
        isActive
          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/20"
          : "bg-zinc-700/60 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-white/5"
      }`}
  >
    Open
    <ExternalLink size={9} />
  </a>
</div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="border-white/10 bg-zinc-900/90 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/20 transition-all -left-4" />
          <CarouselNext className="border-white/10 bg-zinc-900/90 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/20 transition-all -right-4" />
        </Carousel>
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-white/5 bg-zinc-800/30 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
            <FileText size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mt-5">No Documents Yet</h3>
          <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Upload your first PDF to start chatting with Neuron AI.
          </p>
        </div>
      )}
    </div>
  );
}