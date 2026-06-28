"use client";

import { useState } from "react";
import { generateFlashcards } from "@/actions/flashcard.actions";
import toast from "react-hot-toast";
import {
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardsProps {
  selectedNote: string | null;
}

export default function Flashcards({ selectedNote }: FlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!selectedNote) {
      toast("Please select a PDF first.", {
        icon: "📄",
        style: {
          background: "#18181b",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#fff",
          borderRadius: "16px",
          fontSize: "14px",
        },
      });
      return;
    }

    try {
      setLoading(true);
      const data = await generateFlashcards(selectedNote);
      setFlashcards(data);
      setCurrentIndex(0);
      setShowAnswer(false);

      toast.success(`${data.length} flashcards generated!`, {
        style: {
          background: "#18181b",
          border: "1px solid rgba(16,185,129,0.3)",
          color: "#fff",
          borderRadius: "16px",
          fontSize: "14px",
        },
        iconTheme: { primary: "#10b981", secondary: "#18181b" },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate flashcards.", {
        style: {
          background: "#18181b",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#fff",
          borderRadius: "16px",
          fontSize: "14px",
        },
        iconTheme: { primary: "#ef4444", secondary: "#18181b" },
      });
    } finally {
      setLoading(false);
    }
  }

  function nextCard() {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="relative mt-10 max-w-6xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.35)]">
              <Brain size={26} className="text-black" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">AI Flashcards</h2>
              <p className="text-zinc-500 mt-2 text-lg">Generate smart revision cards from your PDFs</p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="group px-7 py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black rounded-2xl font-bold flex items-center gap-3 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.35)]"
          >
            {loading ? (
              <><Sparkles size={20} className="animate-spin" /> Generating...</>
            ) : (
              <><Brain size={20} /> Generate Flashcards</>
            )}
          </button>
        </div>

        {/* Empty State */}
        {!flashcards.length && (
          <div className="relative overflow-hidden rounded-[40px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-16 text-center shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(168,85,247,0.35)]">
                <Brain size={34} className="text-black" />
              </div>
              <h3 className="text-3xl font-black text-white mt-8">No Flashcards Yet</h3>
              <p className="text-zinc-500 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
                Generate intelligent AI-powered flashcards from your selected PDF for faster revision and learning.
              </p>
            </div>
          </div>
        )}

        {/* Flashcards */}
        {!!flashcards.length && (
          <>
            <div
              onClick={() => setShowAnswer(!showAnswer)}
              className="group relative overflow-hidden rounded-[40px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/90 backdrop-blur-2xl min-h-[420px] p-12 flex items-center justify-center cursor-pointer hover:border-fuchsia-500/30 hover:-translate-y-1 transition-all duration-500 shadow-[0_0_80px_rgba(168,85,247,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-80" />
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-fuchsia-500/10 blur-[120px] rounded-full" />

              <div className="relative z-10 text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm font-medium backdrop-blur-xl">
                  <Sparkles size={16} />
                  {showAnswer ? "Answer" : "Question"}
                </div>

                <h3 className="text-4xl xl:text-5xl font-black text-white leading-[1.25] tracking-tight mt-10">
                  {showAnswer ? currentCard.answer : currentCard.question}
                </h3>

                <p className="text-zinc-500 mt-12 text-sm tracking-wide uppercase">
                  Click card to flip
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8 flex-wrap gap-5">
              <button
                onClick={previousCard}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-white hover:border-fuchsia-500/30 hover:bg-zinc-900 transition-all duration-300"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              <div className="px-6 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-semibold backdrop-blur-xl">
                {currentIndex + 1} / {flashcards.length}
              </div>

              <button
                onClick={nextCard}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-white hover:border-cyan-500/30 hover:bg-zinc-900 transition-all duration-300"
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}