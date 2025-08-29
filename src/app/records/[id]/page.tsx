import { auth } from "~/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "~/server/db";
import Link from "next/link";
import { ZiweiRecordDetail } from "~/components/records/ziwei-record-detail";

export const runtime = "edge";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecordDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // 获取排盘记录
  const { id } = await params;
  const record = await db.ziweiChart.findFirst({
    where: {
      id: id,
      userId: session.user.id, // 确保用户只能访问自己的记录
    },
  });

  if (!record) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 导航栏 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/records" className="btn btn-ghost btn-sm">
              ← 返回记录列表
            </Link>
            <h1 className="text-3xl font-bold">
              {record.name ? `${record.name}的排盘` : "排盘详情"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/astrology/ziwei" className="btn btn-primary btn-sm">
              新建排盘
            </Link>
            <div className="text-sm text-base-content/70">
              欢迎，{session.user?.name || session.user?.email}
            </div>
          </div>
        </div>

        {/* 排盘详情组件 */}
        <ZiweiRecordDetail record={record} />
      </div>
    </main>
  );
}
