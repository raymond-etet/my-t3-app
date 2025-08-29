import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ZiweiRecordsManager } from "~/components/records/ziwei-records-manager";

export default async function RecordsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 导航栏 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn btn-ghost btn-sm">
              ← 返回首页
            </Link>
            <h1 className="text-3xl font-bold">排盘记录管理</h1>
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

        {/* 记录管理组件 */}
        <ZiweiRecordsManager />
      </div>
    </main>
  );
}
