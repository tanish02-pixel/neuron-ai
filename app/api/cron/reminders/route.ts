import { NextResponse } from "next/server";
import { sendInactiveUserReminders } from "@/actions/reminder.actions";

export async function GET() {
  await sendInactiveUserReminders();

  return NextResponse.json({
    success: true,
  });
}