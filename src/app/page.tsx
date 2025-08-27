import { LoginButton } from "~/components/auth/login-button";
import { auth } from "~/server/auth";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="absolute top-4 right-4">
          <LoginButton />
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>

        {session ? (
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-lg bg-white/10 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">欢迎回来！</h2>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 rounded-full"
                />
              )}
              <p className="text-lg">
                你好，
                <span className="font-semibold">{session.user?.name}</span>！
              </p>
              <p className="text-sm text-gray-300 mt-2">
                邮箱：{session.user?.email}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                用户ID：{session.user?.id}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <a
                href="/profile"
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">用户中心 →</h3>
                <div className="text-lg">管理您的账户信息和设置</div>
              </a>
              <a
                href="https://create.t3.gg/en/introduction"
                target="_blank"
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">文档 →</h3>
                <div className="text-lg">了解更多关于 Create T3 App 的信息</div>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-lg bg-white/10 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">开始使用</h2>
              <p className="text-lg mb-6">请登录以体验完整的 T3 App 功能</p>
              <LoginButton />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <a
                href="https://create.t3.gg/en/usage/first-steps"
                target="_blank"
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">第一步 →</h3>
                <div className="text-lg">了解如何设置数据库和身份验证</div>
              </a>
              <a
                href="https://create.t3.gg/en/introduction"
                target="_blank"
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">文档 →</h3>
                <div className="text-lg">了解更多关于 Create T3 App 的信息</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
