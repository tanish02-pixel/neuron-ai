"use server";

import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const utapi = new UTApi();

interface CreateNoteParams {
  name: string;
  url: string;
}

async function extractPdfText(fileUrl: string) {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  const pdf = require("pdf-parse/lib/pdf-parse.js");

  const data = await pdf(Buffer.from(arrayBuffer));

  return data.text
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

export async function createNote({
  name,
  url,
}: CreateNoteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Download once
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to download uploaded PDF");
    }

    const arrayBuffer = await response.arrayBuffer();
    const size = arrayBuffer.byteLength;

    // Parse PDF directly from memory
    const pdf = require("pdf-parse/lib/pdf-parse.js");

    const data = await pdf(Buffer.from(arrayBuffer));

    const content = data.text
      .replace(/\0/g, "")
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, "");

    const note = await prisma.note.create({
      data: {
        name,
        url,
        content,
        size,
        userId,
      },
    });

    return note;
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    throw error;
  }
}

export async function getStorageStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      select: { size: true },
    });

    const flashcards = await prisma.flashcard.findMany({
      where: { userId },
      select: {
        question: true,
        answer: true,
      },
    });

    const chats = await prisma.chat.findMany({
      where: { userId },
      select: {
        question: true,
      },
    });

    const pdfBytes = notes.reduce(
      (acc, note) => acc + note.size,
      0
    );

    const flashcardBytes = flashcards.reduce(
      (acc, flashcard) =>
        acc +
        flashcard.question.length +
        flashcard.answer.length,
      0
    );

    const chatBytes = chats.reduce(
      (acc, chat) => acc + chat.question.length,
      0
    );

    const totalBytes =
      pdfBytes +
      flashcardBytes +
      chatBytes;

    const maxBytes =
      2 * 1024 * 1024 * 1024;

    function formatSize(bytes: number) {
      if (bytes >= 1024 * 1024 * 1024)
        return `${(
          bytes /
          (1024 * 1024 * 1024)
        ).toFixed(1)} GB`;

      if (bytes >= 1024 * 1024)
        return `${(
          bytes /
          (1024 * 1024)
        ).toFixed(1)} MB`;

      if (bytes >= 1024)
        return `${(
          bytes / 1024
        ).toFixed(1)} KB`;

      return `${bytes} B`;
    }

    return {
      pdf: formatSize(pdfBytes),
      flashcards: formatSize(
        flashcardBytes
      ),
      chats: formatSize(chatBytes),
      total: formatSize(totalBytes),
      percent: Math.min(
        Number(
          (
            (totalBytes / maxBytes) *
            100
          ).toFixed(2)
        ),
        100
      ),
      noteCount: notes.length,
    };
  } catch (error) {
    console.error(
      "GET STORAGE ERROR:",
      error
    );
    throw error;
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
      select: {
        url: true,
      },
    });

    const fileKeys = notes
      .map((note) => note.url.split("/f/")[1])
      .filter(Boolean) as string[];

    if (fileKeys.length) {
      await utapi.deleteFiles(fileKeys);
    }

    await prisma.note.deleteMany({
      where: { userId },
    });

    return {
      success: true,
      deleted: notes.length,
    };
  } catch (error) {
    console.error(
      "DELETE ALL NOTES ERROR:",
      error
    );
    throw error;
  }
}

export async function deleteNote(
  noteId: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const note =
      await prisma.note.findUnique({
        where: {
          id: noteId,
        },
      });

    if (!note) {
      throw new Error("Note not found");
    }

    const fileKey =
      note.url.split("/f/")[1];

    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "DELETE NOTE ERROR:",
      error
    );
    throw error;
  }
}