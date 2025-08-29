import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // 构建查询条件 - 只查询当前用户的记录
    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    // 获取排盘记录列表
    const [charts, total] = await Promise.all([
      db.ziweiChart.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          gender: true,
          birthDate: true,
          birthTime: true,
          location: true,
          createdAt: true,
          // 不返回完整的 chartData，减少数据传输量
        },
      }),
      db.ziweiChart.count({ where }),
    ]);

    return NextResponse.json({
      charts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取排盘记录失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
