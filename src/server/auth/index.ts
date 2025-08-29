import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

// 使用基础配置（不包含数据库适配器）用于Edge Runtime
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
