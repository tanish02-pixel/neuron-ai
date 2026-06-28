"use server";

import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

import fs from "fs";
import path from "path";

import { auth } from "@clerk/nextjs/server";

const utapi = new UTApi();

interface CreateNoteParams {
  name: string;
  url: string;
}

async function extractPdfText(fileUrl: string) {
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();

  const tempFilePath = path.join(
    process.cwd(),
    `${Date.now()}.pdf`
  );

  fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

  const pdf = require("pdf-parse/lib/pdf-parse.js");
  const dataBuffer = fs.readFileSync(tempFilePath);
  const data = await pdf(dataBuffer);

  fs.unlinkSync(tempFilePath);

  return data.text
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

export async function createNote({ name, url }: CreateNoteParams) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const content = await extractPdfText(url);

    // File size fetch karo URL se
   const response = await fetch(url);
const arrayBuffer = await response.arrayBuffer();

const size = arrayBuffer.byteLength;

    const note = await prisma.note.create({
      data: { name, url, content, size, userId },
    });

    return note;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create note");
  }
}



export async function getStorageStats() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const notes = await prisma.note.findMany({
      where: { userId },
      select: { size: true },
    });

    const flashcards = await prisma.flashcard.findMany({
      where: { userId },
      select: { question: true, answer: true },
    });



     const chats = await prisma.chat.findMany({
      where: { userId },
      select: { question: true },
    });

    // PDF storage — actual file sizes
    const pdfBytes = notes.reduce(
  (acc: number, n: { size: number }) => acc + n.size,
  0
);

    // Flashcards — text size estimate
    const flashcardBytes = flashcards.reduce(
  (acc: number, f: { question: string; answer: string }) =>
    acc + f.question.length + f.answer.length,
  0
);

 const chatBytes = chats.reduce(
  (acc: number, c: { question: string }) =>
    acc + c.question.length,
  0
);

    const totalBytes = pdfBytes + flashcardBytes + chatBytes;
    const maxBytes = 2 * 1024 * 1024 * 1024; // 2 GB

    function formatSize(bytes: number): string {
      if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
      if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${bytes} B`;
    }

    return {
  pdf: formatSize(pdfBytes),
  flashcards: formatSize(flashcardBytes),
  chats: formatSize(chatBytes),
  total: formatSize(totalBytes),

  percent: Math.min(
    Number(
      ((totalBytes / maxBytes) * 100).toFixed(2)
    ),
    100
  ),

  noteCount: notes.length,
};
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch storage stats");
  }

  }

export async function deleteAllNotes() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      select: { url: true },
    });

    if (notes.length > 0) {
     const fileKeys = notes
  .map((note: { url: string }) => {
    const parts = note.url.split("/f/");
    return parts[1] ?? null;
  })
  .filter((key: string | null): key is string => key !== null);
      if (fileKeys.length > 0) {
        await utapi.deleteFiles(fileKeys);
      }
    }

    await prisma.note.deleteMany({
      where: { userId },
    });

    return {
      success: true,
      deleted: notes.length,
    };
  } catch (error) {
    console.error("Delete all notes error:", error);
    throw new Error("Failed to delete notes");
  }
}

export async function deleteNote(noteId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

   const note = await prisma.note.findUnique({
  where: {
    id: noteId,
  },
});

if (!note) {
      throw new Error("Note not found");
    }

    const parts = note.url.split("/f/");
    const fileKey = parts[1];

    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete note");
  }
}