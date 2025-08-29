import Link from "next/link";

export const runtime = "edge";

interface AuthErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const { error } = await searchParams;

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "Configuration":
        return "服务器配置错误，请联系管理员。";
      case "AccessDenied":
        return "访问被拒绝，您没有权限访问此资源。";
      case "Verification":
        return "验证失败，请重试。";
      case "Default":
      default:
        return "认证过程中发生错误，请重试。";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            认证错误
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link
              href="/auth/signin"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              重新登录
            </Link>
            <Link
              href="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
