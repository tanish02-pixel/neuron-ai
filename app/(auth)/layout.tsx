import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    
    <main className="min-h-screen bg-black flex items-center justify-center px-8 py-6 overflow-hidden relative">

      <Link
  href="/"
  className="absolute top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl text-white text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300"
>
  <ArrowLeft size={16} />
  Home
</Link>
      {/* Animated Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 blur-[200px] rounded-full pointer-events-none animate-pulse" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-3 gap-12 items-center">
        {/* Left Image */}
        <div className="hidden lg:flex justify-center">
          <div className="group relative w-[430px] h-[430px] rounded-[36px] overflow-hidden border border-zinc-800 bg-zinc-950/70 backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.12)] hover:border-fuchsia-500/40 transition-all duration-500">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 opacity-80" />

            <img
              src="/neuron-bg.png"
              alt="Neuron AI"
              className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Middle Clerk */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Glow Behind Clerk */}
            <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 to-cyan-500/10 blur-3xl rounded-[40px]" />

            {/* Clerk Wrapper */}
            <div className="relative z-10 backdrop-blur-2xl rounded-[40px]">
              {children}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center">
          <p className="text-cyan-400 font-medium mb-4 tracking-wide">
            AI Powered Workspace
          </p>

          <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-[-0.04em]">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Neuron AI
            </span>
          </h1>

          <p className="text-zinc-400 text-lg mt-6 leading-relaxed max-w-md">
            Upload PDFs, chat with
            documents, generate
            flashcards, and build your
            AI-powered second brain.
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              "AI Chat",
              "Flashcards",
              "Analytics",
            ].map((item) => (
              <div
                key={item}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 px-4 py-2 rounded-2xl text-sm text-white hover:border-fuchsia-500/40 transition-all duration-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 text-zinc-500 text-sm text-center">
        Designed & Developed by{" "}
        <span className="text-white font-semibold">
          Tanish Singh
        </span>
      </footer>
    </main>
  );
}