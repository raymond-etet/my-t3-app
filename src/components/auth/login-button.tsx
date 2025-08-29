"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function LoginButton() {
  const { data: session } = useSession();

  // 调试信息
  console.log("Session data:", session);

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-white">
          欢迎, {session.user?.name || session.user?.email}
        </span>
        {session.user?.role === "admin" && (
          <Link
            href="/admin"
            className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
          >
            管理员控制台
          </Link>
        )}
        <button
          onClick={() => signOut()}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          退出登录
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin?callbackUrl=/calculator/u-contract"
      className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
    >
      登录
    </Link>
  );
}
