# Kilo Code 指导文档: my-t3-app

本文档为 AI 助手 Kilo Code 提供针对 `my-t3-app` 项目的全面技术概述和开发规则。所有后续的开发、修改和维护工作都必须严格遵守本文档。

## 第一部分：项目概述与增强功能

本项目是在 `create-t3-app` 脚手架的基础上构建的全栈 Web 应用，并进行了功能扩展。以下内容是对原始 `TECHNICAL_DOCUMENTATION.md` 的补充和修正。

### 1. 核心技术栈 (已核实)

| 类别          | 技术                                             | 版本            | 备注                           |
| :------------ | :----------------------------------------------- | :-------------- | :----------------------------- |
| **框架**      | [Next.js](https://nextjs.org/)                   | `15.2.3`        | **React 19 特性优先**。        |
| **语言**      | [TypeScript](https://www.typescriptlang.org/)    | `5.8.2`         | 严格类型检查。                 |
| **UI/样式**   | [Tailwind CSS](https://tailwindcss.com/)         | `4.0.15`        | 功能类优先。                   |
| **UI 组件库** | [daisyUI](https://daisyui.com/)                  | `5.0.51`        | 基于 Tailwind CSS 的组件库。   |
| **ORM**       | [Prisma](https://www.prisma.io/)                 | `6.5.0`         | Node.js 和 TypeScript 的 ORM。 |
| **数据库**    | [PostgreSQL](https://www.postgresql.org/)        | Neon 托管       | 通过 `DATABASE_URL` 连接。     |
| **认证**      | [NextAuth.js](https://next-auth.js.org/)         | `5.0.0-beta.25` | **混合认证模式**。             |
| **包管理器**  | [pnpm](https://pnpm.io/)                         | `10.15.0`       | **必须始终使用 pnpm**。        |
| **密码加密**  | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `3.0.2`         | 用于用户密码加密。             |

### 2. 认证系统：用户名/密码认证

项目使用**传统的用户名/密码认证**。

- **登录方式**: 用户可以使用邮箱和密码进行注册和登录。
- **数据库模型**: [`prisma/schema.prisma`](prisma/schema.prisma) 中的 `User` 模型已添加可选的 `password` 字段来存储哈希后的密码。
- **核心认证逻辑**:
  - **登录验证**: [`src/server/auth/config.ts`](src/server/auth/config.ts) 中配置了 `CredentialsProvider`，负责处理邮箱和密码的验证逻辑，使用 `bcryptjs` 进行密码比对。
  - **新用户注册**: API 路由 [`src/app/api/auth/register/route.ts`](src/app/api/auth/register/route.ts) 提供了用户注册的端点，负责接收用户信息、加密密码并存入数据库。
- **认证页面**:
  - 登录页: [`src/app/auth/signin/page.tsx`](src/app/auth/signin/page.tsx)
  - 注册页: [`src/app/auth/signup/page.tsx`](src/app/auth/signup/page.tsx)

### 3. 核心功能：U 本位合约计算器

项目包含一个为加密货币衍生品交易设计的 **U 本位合约计算器**。

- **功能入口**: [`src/app/calculator/u-contract/page.tsx`](src/app/calculator/u-contract/page.tsx)
- **核心组件**: [`src/components/calculator/u-contract-calculator.tsx`](src/components/calculator/u-contract-calculator.tsx) 是计算器的主体，整合了所有输入、显示和计算逻辑。
- **功能特点**:
  - **实时数据**: 通过自定义 Hook `useBinanceData` 从币安 API 获取交易对的实时价格、资金费率等数据。
  - **核心计算逻辑**: 自定义 Hook `useCalculations` 负责根据用户输入的开仓价、止损价、止损金额等参数，计算出所需的保证金、杠杆倍数和交易费用。
  - **交互式 UI**: 用户可以通过表单输入交易参数，右侧区域会实时显示计算结果和从 API 获取的市场数据。

### 4. 项目结构补充

```
src/
├── app/
│   ├── calculator/              # 计算器功能模块
│   │   └── u-contract/
│   │       └── page.tsx         # U本位合约计算器页面
│   ├── auth/                    # 认证相关页面
│   │   ├── signin/page.tsx      # 登录页
│   │   └── signup/page.tsx      # 注册页
│   └── api/
│       └── auth/
│           ├── register/        # 用户名密码注册 API
│           │   └── route.ts
│           └── [...nextauth]/   # NextAuth.js 核心路由
│               └── route.ts
├── components/
│   ├── auth/                    # 认证相关组件 (登录/注册表单等)
│   └── calculator/              # 计算器相关组件 (输入框、选择器、结果显示)
├── hooks/
│   ├── use-binance-data.ts      # 获取币安数据的 Hook
│   └── use-calculations.ts      # 执行合约计算的 Hook
└── server/
    └── auth/
        └── config.ts            # NextAuth.js 配置文件 (包含 CredentialsProvider)
```

## 第二部分：Kilo Code 核心规则

作为本项目的 AI 助手，我将严格遵循以下规则：

1.  **包管理器**: **始终使用 `pnpm`**。任何新增、删除或更新依赖的操作都必须通过 `pnpm` 命令执行 (例如 `pnpm add`, `pnpm install`)。

2.  **代码注释**: **所有新增或修改的代码都必须包含清晰、表意明确的中文注释**。这对于初学者理解代码至关重要。

3.  **技术选型**:

    - **React**: 优先使用 React 19 的新特性（如 Actions, `useOptimistic` 等）。
    - **Next.js**: 遵循 Next.js 15 的最新范式，例如 App Router、Server Components 和 Server Actions。
    - **身份验证**: 维护好现有的混合认证模式。任何与认证相关的修改都需要同时考虑 OAuth 和 Credentials 两种方式。

4.  **数据库操作**:

    - **严禁直接推送**: 绝不使用 `prisma db push`。
    - **迁移优先**: 所有数据库模型的变更都必须通过创建新的迁移文件来完成（使用 `pnpm exec prisma migrate dev --name <migration_name>`）。
    - **客户端单例**: 数据库操作必须通过 [`src/server/db.ts`](src/server/db.ts) 中导出的 `db` 单例进行，以确保连接的复用和性能。

5.  **环境变量**: 任何需要新增的环境变量，都必须首先在 `src/env.js` 中使用 `t3-env` 进行类型安全的定义和校验，并在 `.env.example` 文件中添加相应的条目。

6.  **代码风格与质量**:

    - **组件化**: 遵循原子化设计的原则，将复杂的 UI 拆分为可复用的、功能单一的小组件。
    - **自定义 Hooks**: 将可复用的业务逻辑（如 API 请求、复杂计算）抽离到自定义 Hooks 中，保持组件代码的整洁。
    - **类型安全**: 充分利用 TypeScript，为所有函数参数、返回值和重要变量添加明确的类型定义。

7.  **文件路径**: 所有文件引用都应使用相对于项目根目录 (`~/`) 的别名路径，以提高代码的可读性和可维护性。

8.  **API 设计**: 新增的 API 端点应遵循 RESTful 风格，并提供清晰的请求和响应结构。在 `src/app/api/` 目录下创建相应的路由文件。
