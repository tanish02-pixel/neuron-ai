"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function sendTestReminder() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const client = await clerkClient();

  const user =
    await client.users.getUser(userId);

  const email =
    user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Email not found");
  }

  const notes = await prisma.note.count({
    where: { userId },
  });

  const flashcards =
    await prisma.flashcard.count({
      where: { userId },
    });

  const chats =
    await prisma.chat.count({
      where: { userId },
    });

  const userNotes =
    await prisma.note.findMany({
      where: { userId },
      select: {
        name: true,
      },
      take: 3,
    });

const suggestions =
  await generateRevisionSuggestions(
    userId
  );

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject:
      "📚 Your Neuron AI workspace misses you",

    html: `
<div style="font-family:Arial,sans-serif;background:#0a0a0a;padding:40px;">
  <div style="max-width:650px;margin:auto;background:#111827;border-radius:24px;overflow:hidden;">

    <div style="background:linear-gradient(135deg,#06b6d4,#d946ef);padding:40px;text-align:center;">
      <h1 style="margin:0;color:black;">🧠 Neuron AI</h1>
      <p style="color:#111;">
        Your learning workspace misses you
      </p>
    </div>

    <div style="padding:30px;color:white;">

      <h2>📚 Time to get back to learning</h2>

      <h3>Your Progress</h3>

       <ul>
        <li>📚 ${notes} PDFs</li>
        <li>🧠 ${flashcards} Flashcards</li>
        <li>💬 ${chats} AI Chats</li>
      </ul>

      <h3>Your PDFs</h3>

      <ul>
        ${userNotes
          .map((n: { name: string }) => `<li>${n.name}</li>`)
          .join("")}
      </ul>

      <h3>Suggested Revision Today</h3>

      <ul>
        ${suggestions
          .map((s) => `<li>${s}</li>`)
          .join("")}
      </ul>

      <div style="margin-top:30px;text-align:center;">
        <a
          href="http://localhost:3000/dashboard"
          style="
            background:#06b6d4;
            color:black;
            padding:14px 24px;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          Continue Learning →
        </a>
      </div>

    </div>
  </div>
</div>
`,
  });

  return {
    success: true,
  };
}

async function generateRevisionSuggestions(
  userId: string
): Promise<string[]> {
  const notes =
    await prisma.note.findMany({
      where: { userId },
      select: {
        name: true,
        content: true,
      },
      take: 3,
    });

  if (notes.length === 0) {
    return [
      "Review previous notes",
      "Solve practice problems",
      "Revise key concepts",
    ];
  }

  const context = notes
    .map(
  (n: { name: string; content: string }) =>
    `PDF: ${n.name}\n${n.content.slice(0, 2000)}`
)
    .join("\n\n");

      const completion =
    await groq.chat.completions.create({
      model:
        "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
Generate exactly 3 revision topics.

Return ONLY JSON.

Example:
["N-Queens","DFS","M Coloring"]
`,
        },
        {
          role: "user",
          content: context,
        },
      ],
    });

  const result =
    completion.choices[0].message
      .content || "[]";

      try {
    return JSON.parse(result);
  } catch {
    return [
      "Review previous notes",
      "Solve practice problems",
      "Revise key concepts",
    ];
  }
}

export async function sendInactiveUserReminders() {
  const users =
    await prisma.userSettings.findMany({
      where: {
        studyReminders: true,
      },
    });

  const client = await clerkClient();

  for (const setting of users) {
    const diff =
      Date.now() -
      new Date(
        setting.lastActiveAt
      ).getTime();

    const hours =
      diff / (1000 * 60 * 60);

    // Skip active users
    if (hours < 24) continue;

    const user =
      await client.users.getUser(
        setting.userId
      );

    const email =
      user.emailAddresses[0]?.emailAddress;

    if (!email) continue;

    const notes =
      await prisma.note.count({
        where: {
          userId: setting.userId,
        },
      });

    const flashcards =
      await prisma.flashcard.count({
        where: {
          userId: setting.userId,
        },
      });

    const chats =
      await prisma.chat.count({
        where: {
          userId: setting.userId,
        },
      }); 

       const userNotes =
      await prisma.note.findMany({
        where: {
          userId: setting.userId,
        },
        select: {
          name: true,
        },
        take: 3,
      });

   const suggestions =
  await generateRevisionSuggestions(
    setting.userId
  );

  try {
  const result = await resend.emails.send({
    from: "Neuron AI <onboarding@resend.dev>",
    to: email,
    subject: "📚 Your Neuron AI workspace misses you",

      html: `
<div style="font-family:Arial,sans-serif;background:#0a0a0a;padding:40px;">
  <div style="max-width:650px;margin:auto;background:#111827;border-radius:24px;overflow:hidden;">

    <div style="background:linear-gradient(135deg,#06b6d4,#d946ef);padding:40px;text-align:center;">
      <h1 style="margin:0;color:black;">🧠 Neuron AI</h1>
      <p style="color:#111;">
        Your learning workspace misses you
      </p>
    </div>

    <div style="padding:30px;color:white;">

      <h2>📚 Time to get back to learning</h2>

      <p>
        You haven't studied for
        ${Math.floor(hours / 24)}
        day(s).
      </p>

      <h3>Your Progress</h3>

      <ul>
        <li>📚 ${notes} PDFs</li>
        <li>🧠 ${flashcards} Flashcards</li>
        <li>💬 ${chats} AI Chats</li>
      </ul>

      <h3>Your PDFs</h3>

      <ul>
        ${userNotes
          .map((n) => `<li>${n.name}</li>`)
          .join("")}
      </ul>

      <h3>Suggested Revision Today</h3>

      <ul>
        ${suggestions
          .map((s) => `<li>${s}</li>`)
          .join("")}
      </ul>

        <div style="margin-top:30px;text-align:center;">
        <a
          href="http://localhost:3000/dashboard"
          style="
            background:#06b6d4;
            color:black;
            padding:14px 24px;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          Continue Learning →
        </a>
      </div>

    </div>
  </div>
</div>
`,
    });

    console.log(
      "RESEND RESULT:",
      result
    );
  } catch (error) {
    console.error(
      "RESEND ERROR:",
      error
    );
  }
}

return {
  success: true,
};
}