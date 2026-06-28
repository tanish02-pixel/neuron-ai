"use server";

import Groq from "groq-sdk";

import { prisma } from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";
import { updateLastActivity } from "./settings.actions";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateFlashcards(
  selectedNote: string
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      throw new Error(
        "Unauthorized"
      );
    }

    const note =
      await prisma.note.findFirst({
        where: {
          id: selectedNote,
          userId,
        },
      });


    if (!note) {
      throw new Error(
        "Selected note not found"
      );
    }

    const context =
      (note as any).content || "";

    const completion =
      await groq.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `
Generate 10 flashcards from the provided PDF content.

Return ONLY valid JSON array.

Format:
[
  {
    "question": "...",
    "answer": "..."
  }
]  `,
          },

          {
            role: "user",
            content: context,
          },
        ],
      });

    const rawResponse =
      completion.choices[0].message
        .content || "[]";

    const cleaned =
      rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const flashcards =
      JSON.parse(cleaned);

    // Save flashcards per user
    for (const card of flashcards) {
      await prisma.flashcard.create({
        data: {
          question:
            card.question,

          answer:
            card.answer,

          userId,
        },
      });
    }

    await updateLastActivity();

    return flashcards;
  } catch (error) {
    console.log(error);

    throw new Error(
      "Failed to generate flashcards"
    );
  }
}
