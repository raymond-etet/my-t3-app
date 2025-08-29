"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  gender: string | null;
  registrationIp: string | null;
  lastOnlineAt: Date | null;
  createdAt: Date;
  _count: {
    ziweiCharts: number;
  };
}

interface ZiweiChart {
  id: string;
  name: string | null;
  gender: string;
  birthDate: Date;
  birthTime: string;
  location: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [charts, setCharts] = useState<ZiweiChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "charts">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users?search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
    }
  };

  // 获取紫微排盘记录
  const fetchCharts = async (userId?: string) => {
    try {
      const url = userId 
        ? `/api/admin/ziwei-charts?userId=${userId}`
        : "/api/admin/ziwei-charts";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCharts(data.charts);
      }
    } catch (error) {
      console.error("获取排盘记录失败:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchCharts(selectedUserId || undefined)
      ]);
      setLoading(false);
    };
    loadData();
  }, [searchTerm, selectedUserId]);

  const formatDate = (date: Date | null) => {
    if (!date) return "从未";
    return format(new Date(date), "yyyy-MM-dd HH:mm", { locale: zhCN });
  };

  const getGenderText = (gender: string | null) => {
    switch (gender) {
      case "male": return "男";
      case "female": return "女";
      default: return "未设置";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标签页 */}
      <div className="tabs tabs-boxed">
        <button 
          className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          用户管理
        </button>
        <button 
          className={`tab ${activeTab === "charts" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("charts")}
        >
          排盘记录
        </button>
      </div>

      {/* 搜索框 */}
      <div className="form-control">
        <input
          type="text"
          placeholder="搜索用户邮箱或姓名..."
          className="input input-bordered"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 用户列表 */}
      {activeTab === "users" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>用户信息</th>
                <th>角色</th>
                <th>性别</th>
                <th>注册IP</th>
                <th>最后在线</th>
                <th>注册时间</th>
                <th>排盘次数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div>
                      <div className="font-bold">{user.name || "未设置"}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === "admin" ? "badge-error" : "badge-ghost"}`}>
                      {user.role === "admin" ? "管理员" : "普通用户"}
                    </span>
                  </td>
                  <td>{getGenderText(user.gender)}</td>
                  <td>{user.registrationIp || "未记录"}</td>
                  <td>{formatDate(user.lastOnlineAt)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className="badge badge-primary">
                      {user._count.ziweiCharts}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setActiveTab("charts");
                      }}
                    >
                      查看排盘
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 排盘记录列表 */}
      {activeTab === "charts" && (
        <div className="space-y-4">
          {selectedUserId && (
            <div className="alert alert-info">
              <span>正在显示特定用户的排盘记录</span>
              <button
                className="btn btn-sm"
                onClick={() => setSelectedUserId(null)}
              >
                显示全部
              </button>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>排盘对象</th>
                  <th>性别</th>
                  <th>出生信息</th>
                  <th>出生地点</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {charts.map((chart) => (
                  <tr key={chart.id}>
                    <td>
                      <div>
                        <div className="font-bold">{chart.user.name || "未设置"}</div>
                        <div className="text-sm opacity-50">{chart.user.email}</div>
                      </div>
                    </td>
                    <td>{chart.name || "未设置"}</td>
                    <td>{getGenderText(chart.gender)}</td>
                    <td>
                      <div>
                        <div>{format(new Date(chart.birthDate), "yyyy-MM-dd", { locale: zhCN })}</div>
                        <div className="text-sm opacity-50">{chart.birthTime}</div>
                      </div>
                    </td>
                    <td>{chart.location || "未设置"}</td>
                    <td>{formatDate(chart.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
