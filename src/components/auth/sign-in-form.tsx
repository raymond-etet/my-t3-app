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
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center">
            欢迎回来
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            请输入您的登录信息
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">邮箱</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">密码</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    登录中...
                  </>
                ) : (
                  "登录"
                )}
              </button>
            </div>
          </form>

          <div className="divider">或者</div>

          <div className="text-center">
            <p className="text-sm text-base-content/70">
              还没有账号？{" "}
              <a href="/auth/signup" className="link link-primary">
                立即注册
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
