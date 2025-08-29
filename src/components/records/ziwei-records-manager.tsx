"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import Link from "next/link";

interface ZiweiRecord {
  id: string;
  name: string | null;
  gender: string;
  birthDate: string;
  birthTime: string;
  location: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function ZiweiRecordsManager() {
  const [records, setRecords] = useState<ZiweiRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // 获取记录列表
  const fetchRecords = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/user/ziwei-charts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data.charts);
        setPagination(data.pagination);
      } else {
        console.error("获取记录失败");
      }
    } catch (error) {
      console.error("获取记录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 删除记录
  const deleteRecord = async (id: string) => {
    if (!confirm("确定要删除这条排盘记录吗？")) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/user/ziwei-charts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 重新获取记录列表
        await fetchRecords(pagination.page, searchTerm);
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("删除记录失败:", error);
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  };

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(1, searchTerm);
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    fetchRecords(newPage, searchTerm);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: zhCN });
  };

  // 格式化生日
  const formatBirthDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd", { locale: zhCN });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="card bg-white/10 backdrop-blur-sm">
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="搜索姓名或地点..."
              className="input input-bordered flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              搜索
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSearchTerm("");
                  fetchRecords(1, "");
                }}
              >
                清除
              </button>
            )}
          </form>
        </div>
      </div>

      {/* 记录统计 */}
      <div className="stats shadow bg-white/10 backdrop-blur-sm">
        <div className="stat">
          <div className="stat-title text-white/70">总记录数</div>
          <div className="stat-value text-white">{pagination.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title text-white/70">当前页</div>
          <div className="stat-value text-white">
            {pagination.page} / {pagination.totalPages}
          </div>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="card bg-white/10 backdrop-blur-sm">
        <div className="card-body">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-white/70 mb-4">暂无排盘记录</p>
              <Link href="/astrology/ziwei" className="btn btn-primary">
                创建第一个排盘
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-white">
                    <th>姓名</th>
                    <th>性别</th>
                    <th>生日</th>
                    <th>时辰</th>
                    <th>地点</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="text-white/90">
                      <td>{record.name || "未填写"}</td>
                      <td>
                        <span className={`badge ${record.gender === "male" ? "badge-info" : "badge-secondary"}`}>
                          {record.gender === "male" ? "男" : "女"}
                        </span>
                      </td>
                      <td>{formatBirthDate(record.birthDate)}</td>
                      <td>{record.birthTime}</td>
                      <td>{record.location || "未填写"}</td>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/records/${record.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            查看
                          </Link>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => deleteRecord(record.id)}
                            disabled={deleting === record.id}
                          >
                            {deleting === record.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "删除"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              «
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn ${page === pagination.page ? "btn-active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
