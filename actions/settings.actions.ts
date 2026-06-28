"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateStudyReminder(
  studyReminders: boolean
) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      studyReminders,
    },
    create: {
      userId,
      studyReminders,
    },
  });

  return { success: true };
}

export async function getNotificationSettings() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  return (
    settings ?? {
      studyReminders: false,
    }
  );
}

export async function updateLastActivity() {
  const { userId } = await auth();

  if (!userId) return;

  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      lastActiveAt: new Date(),
    },
    create: {
      userId,
      lastActiveAt: new Date(),
    },
  });
}