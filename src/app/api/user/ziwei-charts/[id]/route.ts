import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户身份
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const chartId = params.id;

    // 获取排盘记录详情 - 确保只能访问自己的记录
    const chart = await db.ziweiChart.findFirst({
      where: {
        id: chartId,
        userId: session.user.id, // 确保用户只能访问自己的记录
      },
    });

    if (!chart) {
      return NextResponse.json({ error: "记录不存在或无权访问" }, { status: 404 });
    }

    return NextResponse.json(chart);
  } catch (error) {
    console.error("获取排盘记录详情失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户身份
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const chartId = params.id;

    // 删除排盘记录 - 确保只能删除自己的记录
    const deletedChart = await db.ziweiChart.deleteMany({
      where: {
        id: chartId,
        userId: session.user.id, // 确保用户只能删除自己的记录
      },
    });

    if (deletedChart.count === 0) {
      return NextResponse.json({ error: "记录不存在或无权删除" }, { status: 404 });
    }

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除排盘记录失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
