"use client";

import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ZiweiChart } from "~/components/astrology/ziwei-chart";
import type { ExtendedIztroChart } from "~/components/astrology/ziwei-types";

interface ZiweiRecord {
  id: string;
  name: string | null;
  gender: string;
  birthDate: Date;
  birthTime: string;
  location: string | null;
  chartData: any; // JSON data
  createdAt: Date;
}

interface ZiweiRecordDetailProps {
  record: ZiweiRecord;
}

export function ZiweiRecordDetail({ record }: ZiweiRecordDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "chart">("info");

  // 格式化日期
  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd HH:mm", { locale: zhCN });
  };

  // 格式化生日
  const formatBirthDate = (date: Date) => {
    return format(date, "yyyy-MM-dd", { locale: zhCN });
  };

  return (
    <div className="space-y-6">
      {/* 标签页导航 */}
      <div className="tabs tabs-boxed bg-white/10 backdrop-blur-sm">
        <button
          className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          基本信息
        </button>
        <button
          className={`tab ${activeTab === "chart" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          排盘结果
        </button>
      </div>

      {/* 基本信息标签页 */}
      {activeTab === "info" && (
        <div className="card bg-white/10 backdrop-blur-sm">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">基本信息</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/70">姓名</span>
                  </label>
                  <div className="input input-bordered bg-white/5 text-white">
                    {record.name || "未填写"}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/70">性别</span>
                  </label>
                  <div className="input input-bordered bg-white/5 text-white">
                    <span
                      className={`badge ${
                        record.gender === "male"
                          ? "badge-info"
                          : "badge-secondary"
                      }`}
                    >
                      {record.gender === "male" ? "男" : "女"}
                    </span>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/70">出生日期</span>
                  </label>
                  <div className="input input-bordered bg-white/5 text-white">
                    {formatBirthDate(record.birthDate)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/70">出生时辰</span>
                  </label>
                  <div className="input input-bordered bg-white/5 text-white">
                    {record.birthTime}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/70">出生地点</span>
                  </label>
                  <div className="input input-bordered bg-white/5 text-white">
                    {record.location || "未填写"}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/70">创建时间</span>
                  </label>
                  <div className="input input-bordered bg-white/5 text-white">
                    {formatDate(record.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* 排盘基本信息 */}
            {record.chartData && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">排盘概要</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="stat bg-white/5 rounded-lg">
                    <div className="stat-title text-white/70">农历</div>
                    <div className="stat-value text-lg text-white">
                      {record.chartData.lunarDate || "未知"}
                    </div>
                  </div>
                  <div className="stat bg-white/5 rounded-lg">
                    <div className="stat-title text-white/70">八字</div>
                    <div className="stat-value text-lg text-white">
                      {record.chartData.chineseDate || "未知"}
                    </div>
                  </div>
                  <div className="stat bg-white/5 rounded-lg">
                    <div className="stat-title text-white/70">五行局</div>
                    <div className="stat-value text-lg text-white">
                      {record.chartData.fiveElementsClass || "未知"}
                    </div>
                  </div>
                  <div className="stat bg-white/5 rounded-lg">
                    <div className="stat-title text-white/70">命宫</div>
                    <div className="stat-value text-lg text-white">
                      {record.chartData.earthlyBranchOfSoulPalace || "未知"}
                    </div>
                  </div>
                  <div className="stat bg-white/5 rounded-lg">
                    <div className="stat-title text-white/70">身宫</div>
                    <div className="stat-value text-lg text-white">
                      {record.chartData.earthlyBranchOfBodyPalace || "未知"}
                    </div>
                  </div>
                  <div className="stat bg-white/5 rounded-lg">
                    <div className="stat-title text-white/70">星座</div>
                    <div className="stat-value text-lg text-white">
                      {record.chartData.sign || "未知"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 排盘结果标签页 */}
      {activeTab === "chart" && (
        <div className="card bg-white/10 backdrop-blur-sm">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">排盘结果</h2>

            {record.chartData ? (
              <ZiweiChart
                initialData={record.chartData as ExtendedIztroChart}
                readOnly={true}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-white/70">排盘数据不完整</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
