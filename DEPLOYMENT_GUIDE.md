# 部署指南

## 1. GitHub 同步

### 初始化 Git 仓库

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: T3 Stack app with email/password auth"
```

### 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（不要勾选 README，因为本地已有）
3. 复制仓库 URL

### 推送到 GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Vercel 部署

### 方法一：通过 Vercel CLI 部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel --prod
```

### 方法二：通过 GitHub 集成部署

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量：
   - `DATABASE_URL`: 你的数据库连接字符串
   - `AUTH_SECRET`: 你的认证密钥（可以使用 `npx auth secret` 生成）
5. 点击 "Deploy"

## 3. 环境变量配置

### 本地环境 (.env)

```
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
```

### Vercel 环境变量

在 Vercel 项目设置中添加：

- `DATABASE_URL`
- `AUTH_SECRET`

## 4. 数据库迁移

### 本地迁移

```bash
npx prisma migrate dev --name init
```

### 生产环境迁移

```bash
npx prisma migrate deploy
```

## 5. 验证部署

部署完成后，访问你的 Vercel 域名：

- 主页: `https://your-app.vercel.app`
- 登录页: `https://your-app.vercel.app/auth/signin`
- 注册页: `https://your-app.vercel.app/auth/signup`

## 6. 自动部署

每次推送到 main 分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

## 7. 常见问题

### 数据库连接问题

确保数据库允许外部连接（如 Neon、Supabase 等）

### 环境变量未生效

在 Vercel 项目设置中重新检查环境变量

### 构建失败

检查 package.json 中的 scripts 是否正确
