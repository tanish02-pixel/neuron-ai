import Link from "next/link";

import {
  Brain,
  FileText,
  Sparkles,
  MessageSquare,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";



export default async function Home() {
  const { userId } = await auth();

  const features = [
    {
      icon: <FileText size={28} />,
      title: "Smart PDF Notes",
      desc: "Upload documents and let AI understand your knowledge instantly.",
    },

    {
      icon: <MessageSquare size={28} />,
      title: "AI Conversations",
      desc: "Chat with your PDFs like talking to a personal tutor.",
    },

    {
      icon: <Brain size={28} />,
      title: "AI Flashcards",
      desc: "Generate instant revision flashcards automatically.",
    },

    {
      icon: <BarChart3 size={28} />,
      title: "Learning Analytics",
      desc: "Track study performance and AI learning insights.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 blur-[200px] rounded-full pointer-events-none animate-pulse" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-6 border-b border-zinc-800/50 backdrop-blur-xl bg-black/40">
        <h1 className="text-3xl font-black tracking-tight">
          Neuron AI
        </h1>

        <div className="flex items-center gap-4">
          {userId ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="text-zinc-300 hover:text-white transition-all"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/dashboard"
            className="bg-white text-black px-5 py-2 rounded-2xl font-semibold hover:bg-zinc-200 transition-all duration-300"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-32 pb-28 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900/60 px-5 py-2 rounded-full text-sm text-zinc-300 mb-10 backdrop-blur-xl">
          <Sparkles size={16} />
          AI-powered learning workspace
        </div>

        <h1 className="text-5xl md:text-7xl xl:text-8xl font-black max-w-6xl leading-[1.22] tracking-[-0.04em]">
          Your Second Brain
          <span className="block bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Powered by AI
          </span>
        </h1>

        <p className="text-zinc-400 text-xl max-w-2xl mt-8 leading-relaxed">
          Upload PDFs, chat with notes,
          generate flashcards, and build
          your intelligent learning system
          with Neuron AI.
        </p>

        <div className="flex gap-4 mt-12 flex-wrap justify-center">
          {!userId && (
  <Link
    href="/sign-up"
    className="bg-white text-black px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:bg-zinc-200 hover:scale-105 transition-all duration-300"
  >
    Get Started
    <ArrowRight size={18} />
  </Link>
)}

         {userId &&( <Link
            href="/dashboard"
            className="border border-zinc-700 px-8 py-4 rounded-2xl hover:bg-zinc-900 hover:border-zinc-500 transition-all duration-300"
          >
            Open Dashboard
          </Link>
         )}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tight">
              Everything You Need
            </h2>

            <p className="text-zinc-400 mt-5 text-lg">
              Built for students,
              developers, researchers, and
              AI learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map(
              (feature, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-zinc-900/80 to-black/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 hover:border-fuchsia-500/40 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-32">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-2xl border border-zinc-800 rounded-[40px] p-14 text-center shadow-[0_0_80px_rgba(168,85,247,0.08)]">
          <h2 className="text-5xl font-black leading-tight tracking-tight">
  Start Building Your
  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
    AI Knowledge Hub
  </span>
</h2>

<p className="text-zinc-400 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
  One workspace for deep learning and limitless curiosity. Upload
  documents, converse with AI, generate study materials instantly,
  and build a living knowledge system that helps you understand
  faster, remember longer, and think more effectively.
</p>

          
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Neuron AI
            </h3>

            <p className="text-zinc-500 text-sm mt-1">
              AI-powered second brain for
              smarter learning.
            </p>
          </div>

         <div className="text-zinc-500 text-sm text-center md:text-right">
  <p>
    Designed & Developed by{" "}
    <span className="text-white font-semibold">
      Tanish Singh
    </span>
  </p>


  <div className="mt-2 flex flex-col md:items-end gap-1">
   <p className="mt-1">
  <a
    href="mailto:tanishsingh2115@gmail.com"
    className="hover:text-cyan-400 transition-colors"
  >
    Contact
  </a>
  {" • "}
  <a
    href="https://www.linkedin.com/in/tanish-singh-901537289/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-cyan-400 transition-colors"
  >
    LinkedIn
  </a>
</p>
  </div>

  <p className="mt-3">
    © 2026 Neuron AI. All rights reserved.
  </p>
</div>
        </div>
      </footer>
    </main>
  );
}