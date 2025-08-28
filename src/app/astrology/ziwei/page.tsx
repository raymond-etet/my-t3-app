"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ZiweiChart } from "~/components/astrology/ziwei-chart";
import { SignOutButton } from "~/components/auth/sign-out-button";

export default function ZiweiPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/astrology/ziwei");
    }
  }, [status, router]);

  // 加载中状态
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-4 text-lg">正在验证身份...</span>
        </div>
      </div>
    );
  }

  // 如果未登录，显示提示信息
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">需要登录</h1>
          <p className="mb-4">请先登录才能使用紫微排盘功能</p>
          <Link href="/auth/signin" className="btn btn-primary">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* 导航按钮 */}
      <div className="flex justify-between items-center mb-6 px-4">
        <Link href="/" className="btn btn-ghost btn-sm">
          ← 返回首页
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/70">
            欢迎，{session.user?.name || session.user?.email}
          </span>
          <SignOutButton />
        </div>
      </div>

      <ZiweiChart />
    </div>
  );
}
