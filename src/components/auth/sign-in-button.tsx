"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      className="btn btn-primary w-full"
      onClick={() => signIn("credentials", { callbackUrl: "/" })}
    >
      登录
    </button>
  );
}
