import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

/**
 * 检查用户是否为管理员
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}

/**
 * 获取当前用户会话
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * 检查用户是否已登录
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session;
}
