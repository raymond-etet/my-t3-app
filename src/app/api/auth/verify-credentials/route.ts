import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email as string },
    });

    if (!user || !(user as any).password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(
      password as string,
      (user as any).password
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 设置管理员角色
    const role = user.email === "raymondetet@gmail.com" ? "admin" : "user";

    // 更新用户最后在线时间
    await db.user.update({
      where: { id: user.id },
      data: {
        lastOnlineAt: new Date(),
        role: role,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: role,
    });
  } catch (error) {
    console.error("Verify credentials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
