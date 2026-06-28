import MainLayout from "@/components/layout/MainLayout";

import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // User-specific notes
  const notes =
    await prisma.note.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  // User-specific chats
  const totalChats =
    await prisma.chat.count({
      where: {
        userId,
      },
    });

  // User-specific flashcards
  const totalFlashcards =
    await prisma.flashcard.count({
      where: {
        userId,
      },
    });

  return (
    <MainLayout
      notes={notes}
      totalChats={totalChats}
      totalFlashcards={
        totalFlashcards
      }
    />
  );
}