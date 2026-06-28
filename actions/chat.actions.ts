"use server";

import Groq from "groq-sdk";
import { CohereClient } from "cohere-ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function askAI(question: string, selectedNote: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const note = await prisma.note.findFirst({
      where: { id: selectedNote, userId },
    });

    if (!note) throw new Error("Selected note not found");

    // Step 1: Generate embedding for question
    const embeddingResponse = await cohere.embed({
      texts: [question],
      model: "embed-english-v3.0",
      inputType: "search_query",
    });

    const questionEmbedding = (embeddingResponse.embeddings as number[][])[0];

    // Step 2: Find similar chunks from pgvector
    const { data: similarChunks, error } = await supabase.rpc(
      "match_note_embeddings",
      {
        query_embedding: questionEmbedding,
        match_note_id: selectedNote,
        match_count: 5,
      }
    );

    let context = "";

    if (error || !similarChunks || similarChunks.length === 0) {
      // Fallback to full content
      context = (note as any).content || "";
    } else {
      context = similarChunks
        .map((chunk: any) => chunk.chunk_text)
        .join("\n\n");
    }

    // Save chat analytics
    await prisma.chat.create({
      data: { question, userId },
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
       {
  role: "system",
  content:
    "You are Neuron AI, an intelligent assistant. First try to answer from the provided PDF context. If the answer is not found in the PDF context, use your general knowledge to answer but mention that 'This answer is based on general knowledge, not from the PDF.'",
},
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${question}`,
        },
      ],
    });

    return (
      completion.choices[0].message.content || "No response generated."
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get AI response");
  }
}