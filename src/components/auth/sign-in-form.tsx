"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function SignIn({ callbackUrl }: { callbackUrl?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: callbackUrl || "/",
      });

      if (result?.error) {
        setError("登录失败，请检查邮箱和密码");
      }
    } catch (error) {
      setError("登录时发生错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-base-content mb-2">
              欢迎回来
            </h2>
            <p className="text-base-content/70">请输入您的登录信息</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                密码
              </label>
              <input
                type="password"
                placeholder="请输入密码"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  登录中...
                </>
              ) : (
                "登录"
              )}
            </button>
          </form>

          <div className="divider my-8">或者</div>

          <div className="text-center">
            <p className="text-sm text-base-content/70">
              还没有账号？{" "}
              <a href="/auth/signup" className="link link-primary font-medium">
                立即注册
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
