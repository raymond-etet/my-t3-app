"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      退出登录
    </button>
  );
}
