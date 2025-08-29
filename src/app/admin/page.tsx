import { requireAdmin } from "~/lib/auth-utils";
import UserManagement from "~/components/admin/user-management";

export default async function AdminPage() {
  // 确保只有管理员可以访问
  await requireAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">管理员控制台</h1>
        <p className="text-gray-600 mt-2">用户管理和系统监控</p>
      </div>
      
      <UserManagement />
    </div>
  );
}
