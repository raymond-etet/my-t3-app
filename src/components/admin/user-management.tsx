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
  const [selectedChart, setSelectedChart] = useState<ZiweiChart | null>(null);
  const [showChartModal, setShowChartModal] = useState(false);

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
        fetchCharts(selectedUserId || undefined),
      ]);
      setLoading(false);
    };
    loadData();
  }, [searchTerm, selectedUserId]);

  const formatDate = (date: Date | null) => {
    if (!date) return "从未";
    return format(new Date(date), "yyyy-MM-dd HH:mm", { locale: zhCN });
  };

  // 时辰转换为时间
  const convertTimeToHour = (timeStr: string) => {
    // 如果已经是时间格式，直接返回
    if (timeStr.includes(":")) {
      return timeStr;
    }

    // 时辰映射表
    const timeMapping: { [key: string]: string } = {
      子时: "00:00",
      丑时: "02:00",
      寅时: "04:00",
      卯时: "06:00",
      辰时: "08:00",
      巳时: "10:00",
      午时: "12:00",
      未时: "14:00",
      申时: "16:00",
      酉时: "18:00",
      戌时: "20:00",
      亥时: "22:00",
    };

    return timeMapping[timeStr] || "12:00";
  };

  const getGenderText = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "男";
      case "female":
        return "女";
      default:
        return "未设置";
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
    <div className="min-h-screen bg-base-200">
      {/* 面包屑导航 */}
      <div className="breadcrumbs text-sm bg-base-100 px-6 py-4 shadow-sm">
        <ul>
          <li>
            <a href="/" className="link link-hover">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              首页
            </a>
          </li>
          <li>
            <span className="text-base-content/70">管理员控制台</span>
          </li>
        </ul>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* 页面标题和统计卡片 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-6">
            管理员控制台
          </h1>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-100 shadow-lg rounded-lg">
              <div className="stat-figure text-primary">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title">总用户数</div>
              <div className="stat-value text-primary">{users.length}</div>
              <div className="stat-desc">已注册用户</div>
            </div>

            <div className="stat bg-base-100 shadow-lg rounded-lg">
              <div className="stat-figure text-secondary">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">排盘记录</div>
              <div className="stat-value text-secondary">{charts.length}</div>
              <div className="stat-desc">总排盘次数</div>
            </div>

            <div className="stat bg-base-100 shadow-lg rounded-lg">
              <div className="stat-figure text-accent">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">今日活跃</div>
              <div className="stat-value text-accent">
                {
                  users.filter(
                    (user) =>
                      user.lastOnlineAt &&
                      new Date(user.lastOnlineAt).toDateString() ===
                        new Date().toDateString()
                  ).length
                }
              </div>
              <div className="stat-desc">今日登录用户</div>
            </div>

            <div className="stat bg-base-100 shadow-lg rounded-lg">
              <div className="stat-figure text-info">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">管理员</div>
              <div className="stat-value text-info">
                {users.filter((user) => user.role === "admin").length}
              </div>
              <div className="stat-desc">系统管理员</div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="tabs tabs-lifted mb-6">
          <button
            className={`tab tab-lg ${
              activeTab === "users" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              ></path>
            </svg>
            用户管理
          </button>
          <button
            className={`tab tab-lg ${
              activeTab === "charts" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("charts")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              ></path>
            </svg>
            排盘记录
          </button>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text font-medium">搜索</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder={
                      activeTab === "users"
                        ? "搜索用户邮箱或姓名..."
                        : "搜索排盘记录..."
                    }
                    className="input input-bordered flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square btn-primary">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              {activeTab === "charts" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">筛选</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={selectedUserId || ""}
                    onChange={(e) => setSelectedUserId(e.target.value || null)}
                  >
                    <option value="">所有用户</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        {activeTab === "users" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  用户列表
                </h2>
                <div className="badge badge-primary badge-lg">
                  {users.length} 位用户
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>用户信息</th>
                      <th>角色</th>
                      <th>性别</th>
                      <th>注册信息</th>
                      <th>活动状态</th>
                      <th>排盘统计</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover">
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                                <span className="text-xl">
                                  {(user.name || user.email || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-base">
                                {user.name || "未设置姓名"}
                              </div>
                              <div className="text-sm opacity-70">
                                {user.email}
                              </div>
                              <div className="text-xs opacity-50">
                                ID: {user.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === "admin"
                                ? "badge-error badge-outline"
                                : "badge-ghost"
                            }`}
                          >
                            {user.role === "admin" ? "管理员" : "普通用户"}
                          </span>
                        </td>
                        <td>
                          {user.gender ? (
                            <span
                              className={`badge badge-sm ${
                                user.gender === "male"
                                  ? "badge-info"
                                  : "badge-secondary"
                              }`}
                            >
                              {getGenderText(user.gender)}
                            </span>
                          ) : (
                            <span className="text-xs opacity-50">未设置</span>
                          )}
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm">
                              {formatDate(user.createdAt)}
                            </div>
                            <div className="text-xs opacity-50">
                              IP: {user.registrationIp || "未记录"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <div
                              className={`text-sm ${
                                user.lastOnlineAt &&
                                new Date(user.lastOnlineAt).toDateString() ===
                                  new Date().toDateString()
                                  ? "text-success font-medium"
                                  : "text-base-content"
                              }`}
                            >
                              {formatDate(user.lastOnlineAt)}
                            </div>
                            {user.lastOnlineAt &&
                              new Date(user.lastOnlineAt).toDateString() ===
                                new Date().toDateString() && (
                                <span className="badge badge-success badge-xs">
                                  今日活跃
                                </span>
                              )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-primary badge-lg">
                              {user._count.ziweiCharts}
                            </span>
                            <span className="text-xs opacity-50">次排盘</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-sm btn-primary btn-outline"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setActiveTab("charts");
                              }}
                            >
                              查看排盘
                            </button>
                            <div className="dropdown dropdown-end">
                              <label
                                tabIndex={0}
                                className="btn btn-sm btn-ghost"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                </svg>
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                              >
                                <li>
                                  <a>编辑用户</a>
                                </li>
                                <li>
                                  <a>重置密码</a>
                                </li>
                                <li>
                                  <a className="text-error">删除用户</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 排盘记录列表 */}
        {activeTab === "charts" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  排盘记录
                </h2>
                <div className="badge badge-secondary badge-lg">
                  {charts.length} 条记录
                </div>
              </div>

              {selectedUserId && (
                <div className="alert alert-info mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>正在显示特定用户的排盘记录</span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setSelectedUserId(null)}
                  >
                    显示全部
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>用户信息</th>
                      <th>排盘对象</th>
                      <th>出生信息</th>
                      <th>创建时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.map((chart) => (
                      <tr key={chart.id} className="hover">
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                <span className="text-sm">
                                  {(chart.user.name || chart.user.email || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-sm">
                                {chart.user.name || "未设置"}
                              </div>
                              <div className="text-xs opacity-70">
                                {chart.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="font-medium">
                              {chart.name || "未设置"}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`badge badge-xs ${
                                  chart.gender === "male"
                                    ? "badge-info"
                                    : "badge-secondary"
                                }`}
                              >
                                {chart.gender === "male" ? "男" : "女"}
                              </span>
                              {chart.location && (
                                <span className="badge badge-xs badge-outline">
                                  {chart.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-medium">
                              {format(new Date(chart.birthDate), "yyyy-MM-dd", {
                                locale: zhCN,
                              })}
                            </div>
                            <div className="text-xs opacity-70">
                              {chart.birthTime}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            {formatDate(chart.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setSelectedChart(chart);
                                setShowChartModal(true);
                              }}
                            >
                              预览
                            </button>
                            <a
                              href={`/astrology/ziwei?${new URLSearchParams({
                                birth_date: format(
                                  new Date(chart.birthDate),
                                  "yyyy-MM-dd"
                                ),
                                birth_time: convertTimeToHour(chart.birthTime),
                                gender: chart.gender,
                                name: chart.name || "",
                                location: chart.location || "",
                                lunar: "false",
                              }).toString()}`}
                              className="btn btn-sm btn-outline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              排盘
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 排盘记录预览模态框 */}
        {showChartModal && selectedChart && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">排盘记录详情</h3>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowChartModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="card bg-base-200">
                    <div className="card-body p-4">
                      <h4 className="card-title text-base">基本信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="opacity-70">排盘对象:</span>
                          <span className="font-medium">
                            {selectedChart.name || "未设置"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">性别:</span>
                          <span
                            className={`badge badge-xs ${
                              selectedChart.gender === "male"
                                ? "badge-info"
                                : "badge-secondary"
                            }`}
                          >
                            {selectedChart.gender === "male" ? "男" : "女"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">出生日期:</span>
                          <span className="font-medium">
                            {format(
                              new Date(selectedChart.birthDate),
                              "yyyy年MM月dd日",
                              { locale: zhCN }
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">出生时辰:</span>
                          <span className="font-medium">
                            {selectedChart.birthTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">出生地点:</span>
                          <span className="font-medium">
                            {selectedChart.location || "未设置"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="card bg-base-200">
                    <div className="card-body p-4">
                      <h4 className="card-title text-base">用户信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="opacity-70">用户姓名:</span>
                          <span className="font-medium">
                            {selectedChart.user.name || "未设置"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">用户邮箱:</span>
                          <span className="font-medium">
                            {selectedChart.user.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">创建时间:</span>
                          <span className="font-medium">
                            {formatDate(selectedChart.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <a
                  href={`/astrology/ziwei?${new URLSearchParams({
                    birth_date: format(
                      new Date(selectedChart.birthDate),
                      "yyyy-MM-dd"
                    ),
                    birth_time: convertTimeToHour(selectedChart.birthTime),
                    gender: selectedChart.gender,
                    name: selectedChart.name || "",
                    location: selectedChart.location || "",
                    lunar: "false",
                  }).toString()}`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  打开排盘页面
                </a>
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowChartModal(false)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
