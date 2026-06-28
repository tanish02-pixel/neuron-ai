# Neuron AI 🧠

> **AI-powered PDF study assistant** built with a production-grade RAG (Retrieval-Augmented Generation) pipeline. Upload PDFs, ask questions, and get precise answers grounded in your document content — with intelligent fallback to general knowledge.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Cohere](https://img.shields.io/badge/Cohere-D4A574?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📌 Overview

Neuron AI solves a core problem for students and researchers — **extracting precise information from large PDFs without reading the entire document**. Instead of sending the entire PDF to an LLM (expensive, slow, inaccurate), Neuron AI uses a **semantic chunking + vector search pipeline** to retrieve only the most relevant sections before generating a response.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INDEXING PIPELINE                     │
│                                                             │
│  PDF Upload → Text Extraction → Chunking (500 words)        │
│       → Cohere embed-english-v3.0 (1024-dim vectors)        │
│       → Supabase pgvector (HNSW Index)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        QUERY PIPELINE                        │
│                                                             │
│  User Question → Cohere Embedding (search_query)            │
│       → Cosine Similarity Search → Top-5 Chunks             │
│       → Groq LLaMA 3.3 70B → Grounded Answer               │
│       → Fallback: General Knowledge (if not in PDF)         │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **PDF Upload & Viewer** | Upload PDFs via UploadThing, rendered inline with Google Docs viewer |
| 🧠 **RAG Pipeline** | Semantic chunking → vector embeddings → pgvector similarity search |
| 💬 **AI Chat** | Context-aware answers grounded in PDF content |
| 🔄 **Intelligent Fallback** | Falls back to LLM general knowledge with clear attribution |
| 🃏 **Auto Flashcards** | AI-generated flashcards from PDF content for active recall |
| 📊 **Analytics Dashboard** | Track uploads, chats, and storage usage |
| 🔔 **Email Reminders** | Scheduled study reminders via Resend + Vercel Cron Jobs |
| 🔐 **Auth** | Secure authentication via Clerk |
| ☁️ **Storage Management** | Per-user PDF storage tracking with UploadThing |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Full-stack React framework |
| React 19 | UI layer |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Backend & Database
| Technology | Purpose |
|---|---|
| Next.js Server Actions | Type-safe server-side logic |
| Prisma ORM | Database access layer |
| PostgreSQL (Supabase) | Primary database |
| Supabase pgvector | Vector storage + similarity search |

### AI/ML
| Technology | Purpose |
|---|---|
| Cohere `embed-english-v3.0` | Text embeddings (1024 dimensions) |
| Groq `llama-3.3-70b-versatile` | LLM inference |
| pgvector HNSW Index | Approximate nearest neighbor search |
| Cosine Similarity | Semantic relevance scoring |

### Infrastructure
| Technology | Purpose |
|---|---|
| Vercel | Deployment + Edge Functions |
| Vercel Cron | Scheduled email reminders |
| UploadThing | PDF file storage & CDN |
| Clerk | Authentication & user management |
| Resend | Transactional emails |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL via Supabase (with pgvector enabled)
- Accounts: Clerk, Cohere, Groq, UploadThing, Resend

### 1. Clone & Install
```bash
git clone https://github.com/tanish02-pixel/neuron-ai.git
cd neuron-ai
npm install --legacy-peer-deps
```

### 2. Environment Variables
Create `.env.local`:
```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Prisma
DATABASE_URL=

# UploadThing
UPLOADTHING_TOKEN=

# AI Services
GROQ_API_KEY=
COHERE_API_KEY=

# Email
RESEND_API_KEY=
```

### 3. Supabase pgvector Setup
Run in Supabase SQL Editor:
```sql
create extension if not exists vector;

create table note_embeddings (
  id uuid primary key default gen_random_uuid(),
  note_id text not null,
  user_id text not null,
  chunk_text text not null,
  embedding vector(1024),
  chunk_index int not null,
  created_at timestamp default now()
);

create index on note_embeddings
using hnsw (embedding vector_cosine_ops);

create or replace function match_note_embeddings(
  query_embedding vector(1024),
  match_note_id text,
  match_count int
)
returns table (chunk_text text, similarity float)
language plpgsql as $$
begin
  return query
  select
    note_embeddings.chunk_text,
    1 - (note_embeddings.embedding <=> query_embedding) as similarity
  from note_embeddings
  where note_embeddings.note_id = match_note_id
  order by note_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run
```bash
npm run dev
```

---

## 📁 Project Structure

```
neuron-ai/
├── actions/                    # Next.js Server Actions
│   ├── chat.actions.ts         # RAG query pipeline
│   ├── embedding.actions.ts    # Cohere embedding + pgvector storage
│   ├── note.actions.ts         # PDF CRUD + text extraction
│   ├── settings.actions.ts     # User preferences
│   ├── reminder.actions.ts     # Email reminder logic
│   └── email.actions.ts        # Resend integration
├── app/
│   ├── dashboard/              # Main application page
│   ├── api/
│   │   ├── uploadthing/        # File upload endpoint
│   │   └── cron/reminders/     # Vercel Cron job
│   └── (auth)/                 # Clerk auth pages
├── components/
│   ├── dashboard/
│   │   ├── AIChat.tsx          # Chat interface + RAG trigger
│   │   ├── PDFViewer.tsx       # Inline PDF renderer
│   │   ├── NotesList.tsx       # PDF library
│   │   ├── Flashcards.tsx      # AI flashcard generator
│   │   ├── Analytics.tsx       # Usage analytics
│   │   └── Settings.tsx        # Notification settings
│   └── layout/                 # Navbar, Sidebar, MainLayout
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── uploadthing.ts          # UploadThing config
│   └── resend.ts               # Resend client
└── prisma/
    └── schema.prisma           # Database schema
```

---

## 🔮 Roadmap & Future Improvements

- [ ] **Multi-turn Chat History** — Persistent conversation context across sessions
- [ ] **Multi-document RAG** — Query across multiple PDFs simultaneously
- [ ] **Re-ranking** — Cross-encoder re-ranking for improved retrieval precision
- [ ] **Hybrid Search** — Combine BM25 keyword search with vector search
- [ ] **Streaming Responses** — Real-time token streaming via Vercel AI SDK
- [ ] **Collaborative Rooms** — Share PDFs and chat sessions with teammates
- [ ] **Citation Highlighting** — Highlight exact PDF sections used in answers

---

## 👨‍💻 Author

**Tanish Singh**
B.Tech Computer Science | NIT Raipur (2023–2027)

[![GitHub](https://img.shields.io/badge/GitHub-tanish02--pixel-181717?style=flat&logo=github)](https://github.com/tanish02-pixel)


---

<div align="center">
  <sub>Built with ❤️ for Students</sub>
</div>
