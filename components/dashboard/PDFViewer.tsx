"use client";

import { FileText } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-2xl h-[85vh] shadow-[0_0_60px_rgba(6,182,212,0.08)]">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 border-b border-zinc-800 px-6 py-5 bg-black/20">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center">
          <FileText size={22} className="text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">PDF Viewer</h2>
          <p className="text-zinc-500 text-sm mt-1">AI-ready document preview</p>
        </div>
      </div>

      {/* Google Docs Viewer iframe */}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
        className="w-full h-[calc(85vh-90px)]"
        style={{ border: "none" }}
      />
    </div>
  );
}