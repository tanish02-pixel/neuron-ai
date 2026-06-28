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

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const note = await prisma.note.findFirst({
      where: {
        id: selectedNote,
        userId,
      },
    });

    if (!note) {
      throw new Error("Selected note not found");
    }

    // Generate embedding for the question
    const embeddingResponse = await cohere.embed({
      model: "embed-english-v3.0",
      texts: [question],
      inputType: "search_query",
    });

    let questionEmbedding: number[];

    if (Array.isArray(embeddingResponse.embeddings)) {
      questionEmbedding = embeddingResponse.embeddings[0] as number[];
    } else {
      questionEmbedding = embeddingResponse.embeddings.float![0];
    }

    console.log(
      "Question embedding dimensions:",
      questionEmbedding.length
    );

    // Vector search
    const { data: similarChunks, error } = await supabase.rpc(
      "match_note_embeddings",
      {
        query_embedding: questionEmbedding,
        match_note_id: selectedNote,
        match_count: 5,
      }
    );

    console.log("RPC ERROR:", error);
    console.log("RPC RESULT:", similarChunks);

    let context = "";

    if (error || !similarChunks || similarChunks.length === 0) {
      console.log("Using full PDF as fallback...");
      context = note.content;
    } else {
      context = similarChunks
        .map((chunk: any) => chunk.chunk_text)
        .join("\n\n");
    }

    await prisma.chat.create({
      data: {
        question,
        userId,
      },
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are Neuron AI. Always answer using the provided PDF context whenever possible. If the answer is not available in the PDF, answer using your own knowledge and clearly mention that the answer is based on general knowledge.",
        },
        {
          role: "user",
          content: `PDF Context:

${context}

Question:
${question}`,
        },
      ],
    });

    return (
      completion.choices[0].message.content ??
      "No response generated."
    );
  } catch (error) {
    console.error("CHAT ERROR:", error);
    throw new Error("Failed to get AI response");
  }
}