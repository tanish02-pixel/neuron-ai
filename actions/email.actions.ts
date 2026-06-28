"use server";

import { resend } from "@/lib/resend";

export async function sendTestEmail() {
  await resend.emails.send({
    from: "Neuron AI <onboarding@resend.dev>",
    to: "tanishsingh2115@gmail.com",
    subject: "Neuron AI Test",
    html: "<h1>Hello from Neuron AI 🚀</h1>",
  });
}