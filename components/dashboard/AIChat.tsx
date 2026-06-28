"use client";

import { useState, useEffect } from "react";
import { askAI } from "@/actions/chat.actions";
import toast from "react-hot-toast";
import { Sparkles, Brain, Send } from "lucide-react";
import { generateEmbeddings } from "@/actions/embedding.actions";

interface AIChatProps {
  selectedNote: string | null;
}

export default function AIChat({ selectedNote }: AIChatProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (selectedNote) {
    generateEmbeddings(selectedNote).catch(console.log);
  }
}, [selectedNote]);

  async function handleAsk() {
    if (!question) return;

    if (!selectedNote) {
      toast("Please select a PDF from Notes section first.", {
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
      const response = await askAI(question, selectedNote);
      setAnswer(response || "");
    } catch (error) {
      console.log(error);
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.35)]">
              <Brain size={22} className="text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Ask Neuron AI</h2>
              <p className="text-zinc-500 mt-1">Chat intelligently with your PDFs</p>
            </div>
          </div>

          {/* Status */}
          <div className={`px-5 py-3 rounded-2xl text-sm font-semibold border backdrop-blur-xl ${
            selectedNote
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {selectedNote ? "PDF Selected" : "No PDF Selected"}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask anything from your selected PDF..."
            className="w-full h-40 bg-zinc-950/80 border border-zinc-800 rounded-[28px] p-6 text-white outline-none resize-none placeholder:text-zinc-500 focus:border-fuchsia-500/40 transition-all duration-300"
          />
          <div className="absolute bottom-5 right-5 text-zinc-600 text-sm">
            AI Powered
          </div>
        </div>

        {/* Prompt Buttons */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {[
            "Summarize this PDF",
            "What are the important topics?",
            "Explain this in simple words",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setQuestion(prompt)}
              className="px-5 py-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-white hover:border-fuchsia-500/40 hover:bg-zinc-900 transition-all duration-300 text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Ask Button */}
        <button
          onClick={handleAsk}
          disabled={loading || !question}
          className="group mt-8 px-8 py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black rounded-2xl font-bold flex items-center gap-3 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <><Sparkles size={20} className="animate-spin" /> Thinking...</>
          ) : (
            <><Send size={20} /> Ask AI</>
          )}
        </button>

        {/* Response */}
        {answer && (
          <div className="mt-8 relative overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center">
                  <Sparkles size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Neuron AI Response</h3>
                  <p className="text-zinc-500 text-sm">Generated using your PDF context</p>
                </div>
              </div>
              <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-[15px]">
                {answer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}