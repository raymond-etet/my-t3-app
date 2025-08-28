"use client";

import { useState } from "react";
import type { IztroChart } from "./ziwei-types";
import { ZiweiPalace } from "./ziwei-palace";
import { ZiweiTextChart } from "./ziwei-text-chart";
import "./ziwei-chart.css";

// 标准紫微斗数十二宫布局映射
// 按照传统排盘顺序：巳午未申，辰-中-酉，卯寅丑子
const PALACE_LAYOUT_MAP = {
  // 第一行：巳(4) 午(5) 未(6) 申(7)
  0: 4, // 第1个位置对应巳宫(index 4)
  1: 5, // 第2个位置对应午宫(index 5)
  2: 6, // 第3个位置对应未宫(index 6)
  3: 7, // 第4个位置对应申宫(index 7)

  // 第二行：辰(3) 中心 中心 酉(8)
  4: 3, // 第5个位置对应辰宫(index 3)
  5: -1, // 中心区域
  6: -1, // 中心区域
  7: 8, // 第8个位置对应酉宫(index 8)

  // 第三行：卯(2) 中心 中心 戌(9)
  8: 2, // 第9个位置对应卯宫(index 2)
  9: -1, // 中心区域
  10: -1, // 中心区域
  11: 9, // 第12个位置对应戌宫(index 9)

  // 第四行：寅(1) 丑(0) 子(11) 亥(10)
  12: 1, // 第13个位置对应寅宫(index 1)
  13: 0, // 第14个位置对应丑宫(index 0)
  14: 11, // 第15个位置对应子宫(index 11)
  15: 10, // 第16个位置对应亥宫(index 10)
};

export function ZiweiChart() {
  const [birthDate, setBirthDate] = useState<string>("2025-01-29");
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [gender, setGender] = useState<string>("male");
  const [lunar, setLunar] = useState<boolean>(false);
  const [chartData, setChartData] = useState<IztroChart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "text">("grid");

  const handleSubmit = async () => {
    if (!birthDate || !birthTime) {
      setError("请填写完整的出生日期和时间");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        birth_date: birthDate,
        birth_time: birthTime,
        gender: gender,
        lunar: lunar.toString(),
      });

      const response = await fetch(`/api/astrology/ziwei?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "排盘失败");
      }

      const data = await response.json();

      // 转换API响应数据为前端需要的格式
      const transformedData: IztroChart = {
        gender: data.gender,
        solarDate: data.solarDate,
        lunarDate: data.lunarDate,
        chineseDate: data.chineseDate,
        time: data.time,
        timeRange: data.timeRange,
        sign: data.sign,
        zodiac: data.zodiac,
        earthlyBranchOfBodyPalace: data.earthlyBranchOfBodyPalace,
        earthlyBranchOfSoulPalace: data.earthlyBranchOfSoulPalace,
        soul: data.soul,
        body: data.body,
        fiveElementsClass: data.fiveElementsClass,
        palaces: data.palaces,
      };

      setChartData(transformedData);

      console.log("排盘成功:", {
        输入类型: lunar ? "农历" : "公历",
        输入日期: birthDate,
        对应公历: data.solarDate,
        对应农历: data.lunarDate,
        八字: data.chineseDate,
        命宫: data.earthlyBranchOfSoulPalace,
        身宫: data.earthlyBranchOfBodyPalace,
        五行局: data.fiveElementsClass,
      });
    } catch (err) {
      console.error("排盘失败:", err);
      setError(err instanceof Error ? err.message : "排盘失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChartData(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生日期
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生时间
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性别
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期类型
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!lunar}
                  onChange={() => setLunar(false)}
                  className="mr-2"
                />
                公历
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={lunar}
                  onChange={() => setLunar(true)}
                  className="mr-2"
                />
                农历
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "排盘中..." : "开始排盘"}
          </button>

          {chartData && (
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              重新排盘
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {chartData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">排盘结果</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                图形排盘
              </button>
              <button
                onClick={() => setViewMode("text")}
                className={`px-4 py-2 rounded-md ${
                  viewMode === "text"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                文字排盘
              </button>
            </div>
          </div>

          {/* 基本信息显示 */}

          {/* 紫微斗数标准排盘显示 */}
          {viewMode === "grid" ? (
            <div className="ziwei-astrolabe">
              {/* 生成12个宫位 */}
              {Array.from({ length: 12 }, (_, palaceIndex) => {
                const palace = chartData.palaces[palaceIndex];
                if (!palace) return null;

                return (
                  <ZiweiPalace
                    key={`palace-${palaceIndex}`}
                    palace={palace}
                    index={palaceIndex}
                    soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
                    bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
                  />
                );
              })}

              {/* 中心区域显示基本信息 - 占据4个格子 */}
              <div className="ziwei-center-area">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center rounded-lg border border-indigo-200 w-full h-full flex flex-col justify-center">
                  <div className="text-lg font-bold text-indigo-800 mb-4">
                    <span
                      className={`mr-2 ${
                        chartData.gender === "男"
                          ? "text-blue-600"
                          : "text-pink-600"
                      }`}
                    >
                      {chartData.gender === "男" ? "♂" : "♀"}
                    </span>
                    基本信息
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        五行局：
                      </span>
                      <span className="text-gray-700">
                        {chartData.fiveElementsClass}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        四柱：
                      </span>
                      <span className="text-gray-700 text-xs">
                        {chartData.chineseDate}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        阳历：
                      </span>
                      <span className="text-gray-700">
                        {chartData.solarDate}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        农历：
                      </span>
                      <span className="text-gray-700">
                        {chartData.lunarDate}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        时辰：
                      </span>
                      <span className="text-gray-700">
                        {chartData.time}({chartData.timeRange})
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        生肖：
                      </span>
                      <span className="text-gray-700">{chartData.zodiac}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        星座：
                      </span>
                      <span className="text-gray-700">{chartData.sign}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        命主：
                      </span>
                      <span className="text-gray-700">{chartData.soul}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        身主：
                      </span>
                      <span className="text-gray-700">{chartData.body}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        命宫：
                      </span>
                      <span className="text-gray-700">
                        {chartData.earthlyBranchOfSoulPalace}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-indigo-700 block">
                        身宫：
                      </span>
                      <span className="text-gray-700">
                        {chartData.earthlyBranchOfBodyPalace}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ZiweiTextChart chartData={chartData} />
          )}
        </div>
      )}
    </div>
  );
}
