import { NextResponse } from "next/server";
import { auth } from "~/server/auth";

export const runtime = "edge";

export async function GET() {
  try {
    const session = await auth();

    return NextResponse.json({
      session,
      user: session?.user,
      role: session?.user?.role,
    });
  } catch (error) {
    console.error("Debug session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
