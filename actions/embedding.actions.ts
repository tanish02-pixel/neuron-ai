"use server";

import { CohereClient } from "cohere-ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function chunkText(text: string, chunkSize = 500): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

export async function generateEmbeddings(noteId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    console.log("Generating embeddings for:", noteId);

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!note) {
      throw new Error("Note not found");
    }

    if (!note.content) {
      throw new Error("Note content is empty");
    }

    const chunks = chunkText(note.content);

    console.log(`Created ${chunks.length} chunks`);

    // Delete previous embeddings
    const { error: deleteError } = await supabase
      .from("note_embeddings")
      .delete()
      .eq("note_id", noteId);

    if (deleteError) {
      console.error("DELETE ERROR:", deleteError);
      throw deleteError;
    }

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Embedding chunk ${i + 1}/${chunks.length}`);

      const response = await cohere.embed({
        model: "embed-english-v3.0",
        texts: [chunks[i]],
        inputType: "search_document",
      });

      let embedding: number[];

      if (Array.isArray(response.embeddings)) {
        embedding = response.embeddings[0] as number[];
      } else {
        embedding = response.embeddings.float![0];
      }

      console.log("Embedding dimensions:", embedding.length);

      const { data, error } = await supabase
        .from("note_embeddings")
        .insert({
          note_id: noteId,
          user_id: userId,
          chunk_text: chunks[i],
          embedding: embedding, // DO NOT JSON.stringify
          chunk_index: i,
        })
        .select();

      console.log("INSERT DATA:", data);
      console.log("INSERT ERROR:", error);

      if (error) {
        throw error;
      }
    }

    console.log("Embeddings generated successfully.");

    return {
      success: true,
      chunks: chunks.length,
    };
  } catch (error: any) {
  console.error("========== EMBEDDING ERROR ==========");
  console.error(error);
  console.error(error?.message);
  console.error(error?.stack);

  throw error;
}
}