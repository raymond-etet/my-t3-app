import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./config";
import { db } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// 完整配置，包含数据库适配器，用于Node.js Runtime
export const {
  auth: fullAuth,
  handlers: fullHandlers,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" }, // 使用数据库会话策略
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !(user as any).password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          (user as any).password
        );

        if (!isPasswordValid) {
          return null;
        }

        // 设置管理员角色
        const role = user.email === "raymondetet@gmail.com" ? "admin" : "user";

        // 更新用户最后在线时间
        await db.user.update({
          where: { id: user.id },
          data: {
            lastOnlineAt: new Date(),
            role: role,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: role,
        };
      },
    }),
  ],
  callbacks: authConfig.callbacks,
  pages: authConfig.pages,
});
