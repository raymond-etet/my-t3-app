import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginButton } from "~/components/auth/login-button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="absolute top-4 right-4">
          <LoginButton />
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          用户资料
        </h1>

        <div className="w-full max-w-md rounded-lg bg-white/10 p-8">
          <div className="flex flex-col items-center gap-6">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-white/20"
              />
            )}

            <div className="text-center">
              <h2 className="text-3xl font-bold">{session.user?.name}</h2>
              <p className="text-lg text-gray-300 mt-2">
                {session.user?.email}
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  用户ID
                </h3>
                <p className="text-sm font-mono break-all">
                  {session.user?.id}
                </p>
              </div>

              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  登录状态
                </h3>
                <p className="text-sm text-green-400">✓ 已验证</p>
              </div>

              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  提供商
                </h3>
                <p className="text-sm">Discord OAuth</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/astrology/ziwei"
                className="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 text-center"
              >
                🔮 新建紫微排盘
              </a>
              <a
                href="/"
                className="rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 text-center"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
