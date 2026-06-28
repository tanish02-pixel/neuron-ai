"use client";

import { createNote } from "@/actions/note.actions";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Upload, Sparkles, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface UploadBoxProps {
  setNotes: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        url: string;
      }[]
    >
  >;
}

export default function UploadBox({ setNotes }: UploadBoxProps) {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/90 backdrop-blur-2xl p-12 shadow-[0_0_80px_rgba(168,85,247,0.08)]">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(168,85,247,0.35)]">
            <Upload size={34} className="text-black" />
          </div>

          <h2 className="text-4xl font-black text-white mt-8 tracking-tight">
            Upload Your Notes
          </h2>

          <p className="text-zinc-400 text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Upload PDFs and let Neuron AI understand your knowledge, generate flashcards, and answer questions instantly.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mt-12 relative overflow-hidden rounded-[36px] border-2 border-dashed border-zinc-700 bg-zinc-950/70 backdrop-blur-2xl p-12 hover:border-fuchsia-500/40 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <FileText size={28} className="text-cyan-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mt-6">
              Drag & Drop PDF Files
            </h3>

            <p className="text-zinc-500 mt-4 text-center max-w-lg leading-relaxed">
              Upload your study material, notes, research papers, or documentation to interact with them using AI.
            </p>

            {/* Upload Button */}
            <div className="mt-10">
              <UploadButton<OurFileRouter, "pdfUploader">
                endpoint="pdfUploader"
                appearance={{
                  button:
                    "ut-ready:bg-gradient-to-r ut-ready:from-cyan-400 ut-ready:to-fuchsia-500 ut-ready:text-black ut-ready:font-bold ut-ready:px-8 ut-ready:py-4 ut-ready:rounded-2xl ut-ready:shadow-[0_0_30px_rgba(168,85,247,0.35)] ut-ready:hover:scale-[1.03] transition-all duration-300",
                  allowedContent: "text-zinc-500",
                  container: "flex flex-col items-center gap-4",
                }}
                onClientUploadComplete={async (res) => {
                  if (!res) return;
                  const file = res[0];

                   const toastId = toast.loading("Saving to workspace...", {
                    style: {
                      background: "#18181b",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#fff",
                      borderRadius: "16px",
                      fontSize: "14px",
                    },
                  });

                  try {
                   const note = await createNote({
  name: file.name,
  url: file.ufsUrl,
});

setNotes((prev) => [
  {
    id: note.id,
    name: note.name,
    url: note.url,
  },
  ...prev,
]);

                    toast.success("PDF saved to your workspace!", {
                      id: toastId,
                      style: {
                        background: "#18181b",
                        border: "1px solid rgba(16,185,129,0.3)",
                        color: "#fff",
                        borderRadius: "16px",
                        fontSize: "14px",
                      },
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#18181b",
                      },
                    });
                  } catch {
                    toast.error("Failed to save PDF. Please try again.", {
                      id: toastId,
                      style: {
                        background: "#18181b",
                        border: "1px solid rgba(239,68,68,0.3)",
                        color: "#fff",
                        borderRadius: "16px",
                        fontSize: "14px",
                      },
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#18181b",
                      },
                    });
                  }
                }}
                  onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`, {
                    style: {
                      background: "#18181b",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fff",
                      borderRadius: "16px",
                      fontSize: "14px",
                    },
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#18181b",
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {[
            { title: "AI Chat", desc: "Chat with uploaded PDFs intelligently" },
            { title: "Flashcards", desc: "Generate instant revision cards" },
            { title: "Smart Insights", desc: "Understand key concepts faster" },
          ].map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950/70 backdrop-blur-2xl p-6 hover:border-fuchsia-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-70" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-cyan-400" />
                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                </div>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}