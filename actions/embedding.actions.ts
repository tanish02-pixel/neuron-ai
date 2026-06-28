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
    if (!userId) throw new Error("Unauthorized");

    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) throw new Error("Note not found");

    const content = (note as any).content || "";
    if (!content) throw new Error("Note has no content");

    // Delete old embeddings
    await supabase
      .from("note_embeddings")
      .delete()
      .eq("note_id", noteId);

    const chunks = chunkText(content);

    for (let i = 0; i < chunks.length; i++) {
      const response = await cohere.embed({
        texts: [chunks[i]],
        model: "embed-english-v3.0",
        inputType: "search_document",
      });

      const embedding = (response.embeddings as number[][])[0];

      await supabase.from("note_embeddings").insert({
        note_id: noteId,
        user_id: userId,
        chunk_text: chunks[i],
        embedding: JSON.stringify(embedding),
        chunk_index: i,
      });
    }

    return { success: true, chunks: chunks.length };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate embeddings");
  }
}