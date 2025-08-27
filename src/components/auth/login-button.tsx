"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
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
