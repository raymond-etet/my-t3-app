import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, gender } = await request.json();

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 });
    }

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "邮箱已被注册" }, { status: 400 });
    }

    // 获取客户端IP地址
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 设置用户角色（检查是否为管理员邮箱）
    const role = email === "raymondetet@gmail.com" ? "admin" : "user";

    // 创建用户
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender: gender || null,
        registrationIp: ip,
        role,
      },
    });

    return NextResponse.json(
      {
        message: "注册成功",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
