"use client";

import { useState } from "react";
import type { ChartType, ExtendedIztroChart } from "./ziwei-types";
import { ZiweiPalace } from "./ziwei-palace";
import { ZiweiTextChart } from "./ziwei-text-chart";

import { ZiweiSanheLines } from "./ziwei-sanhe-lines";
import "./ziwei-chart.css";

export function ZiweiChart() {
  const [birthDate, setBirthDate] = useState<string>("2025-01-29");
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [gender, setGender] = useState<string>("male");
  const [lunar, setLunar] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ExtendedIztroChart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "text">("grid");
  const [chartType, setChartType] = useState<ChartType>("sanhe");
  const [showSanheLines, setShowSanheLines] = useState<boolean>(false);

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
      const transformedData: ExtendedIztroChart = {
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
        chartType: "sanhe", // 默认为三合盘
        // 生成飞星盘、三合盘、四化盘数据
        flyingStars: generateFlyingStarData(data.palaces),
        sanheGroups: generateSanheGroups(),
        sihuaDisplay: generateSihuaDisplay(data.palaces),
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
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

            {/* 排盘类型选项卡 - 只在图形排盘模式下显示 */}
            {viewMode === "grid" && (
              <div className="flex space-x-2 border-b border-gray-200">
                <button
                  onClick={() => setChartType("sanhe")}
                  className={`px-4 py-2 font-medium ${
                    chartType === "sanhe"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  三合盘
                </button>
                <button
                  onClick={() => setChartType("flying")}
                  className={`px-4 py-2 font-medium ${
                    chartType === "flying"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  飞星盘
                </button>
                <button
                  onClick={() => setChartType("sihua")}
                  className={`px-4 py-2 font-medium ${
                    chartType === "sihua"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  四化盘
                </button>
              </div>
            )}
          </div>

          {/* 基本信息显示 */}

          {/* 根据选择的排盘类型和显示模式渲染内容 */}
          {viewMode === "grid" ? (
            <>
              {chartType === "sanhe" && (
                <div
                  className={`ziwei-astrolabe ${getChartTypeClass(chartType)} ${
                    showSanheLines ? "show-sanhe-lines" : ""
                  }`}
                >
                  {/* 三方四正连线切换按钮 */}
                  <button
                    className={`ziwei-sanhe-toggle ${
                      showSanheLines ? "active" : ""
                    }`}
                    onClick={() => setShowSanheLines(!showSanheLines)}
                    title="切换三方四正连线显示"
                  >
                    {showSanheLines ? "隐藏连线" : "显示连线"}
                  </button>

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
                        chartType={chartType}
                        extendedData={chartData}
                      />
                    );
                  })}

                  {/* 三方四正连线 */}
                  <ZiweiSanheLines
                    chartData={chartData}
                    showLines={showSanheLines}
                  />

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
                          <span className="text-gray-700">
                            {chartData.zodiac}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            星座：
                          </span>
                          <span className="text-gray-700">
                            {chartData.sign}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            命主：
                          </span>
                          <span className="text-gray-700">
                            {chartData.soul}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            身主：
                          </span>
                          <span className="text-gray-700">
                            {chartData.body}
                          </span>
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
              )}

              {chartType === "flying" && (
                <div
                  className={`ziwei-astrolabe ${getChartTypeClass(
                    chartType
                  )} flying-star-mode`}
                >
                  {/* 飞星盘：突出显示四化星和飞化关系 */}
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
                        chartType={chartType}
                        extendedData={chartData}
                      />
                    );
                  })}

                  {/* 飞星连线和箭头 */}
                  <div className="flying-star-connections">
                    {chartData.flyingStars?.map((flyingStar, index) => {
                      // 简单的飞星连线显示
                      return (
                        <div
                          key={`flying-${index}`}
                          className="flying-star-indicator"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                            pointerEvents: "none",
                          }}
                        >
                          <div
                            className={`flying-star-badge ${flyingStar.mutagen}`}
                          >
                            {flyingStar.starName}
                            {flyingStar.mutagen}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 中心区域显示四化信息 */}
                  <div className="ziwei-center-area">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center rounded-lg border border-amber-200 w-full h-full flex flex-col justify-center">
                      <div className="text-lg font-bold text-amber-800 mb-4">
                        四化飞星
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <div className="text-left">
                          <span className="font-semibold text-red-600 block">
                            化禄:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.lu
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-blue-600 block">
                            化权:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.quan
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-green-600 block">
                            化科:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.ke
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-gray-600 block">
                            化忌:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.ji
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-amber-700">
                        💫 四化星在各宫位中以特殊颜色标注
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {chartType === "sihua" && (
                <div
                  className={`ziwei-astrolabe ${getChartTypeClass(chartType)}`}
                >
                  {/* 四化盘：专门显示四化星的分布和影响 */}
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
                        chartType={chartType}
                        extendedData={chartData}
                      />
                    );
                  })}

                  {/* 中心区域显示四化统计 */}
                  <div className="ziwei-center-area">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 text-center rounded-lg border border-purple-200 w-full h-full flex flex-col justify-center">
                      <div className="text-lg font-bold text-purple-800 mb-4">
                        四化统计
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold text-red-600">
                            化禄:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.lu.length || 0}颗
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-blue-600">
                            化权:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.quan.length || 0}颗
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-green-600">
                            化科:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.ke.length || 0}颗
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">
                            化忌:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.ji.length || 0}颗
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ZiweiTextChart chartData={chartData} />
          )}
        </div>
      )}
    </div>
  );
}

// 辅助函数：根据排盘类型返回CSS类名
function getChartTypeClass(chartType: ChartType): string {
  switch (chartType) {
    case "flying":
      return "ziwei-flying-chart";
    case "sihua":
      return "ziwei-sihua-chart";
    case "sanhe":
    default:
      return "ziwei-sanhe-chart";
  }
}

// 临时辅助函数：生成飞星盘数据（后续完善）
function generateFlyingStarData(palaces: any[]): any[] {
  // 简化实现，寻找带四化的星曜
  const flyingStars: any[] = [];
  palaces.forEach((palace, palaceIndex) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    allStars.forEach((star) => {
      if (star.mutagen) {
        flyingStars.push({
          fromPalace: palaceIndex,
          toPalace: palaceIndex, // 暂时设为同宫位，后续优化
          starName: star.name,
          mutagen: star.mutagen,
          level: "life",
        });
      }
    });
  });
  return flyingStars;
}

// 临时辅助函数：生成三合盘数据
function generateSanheGroups(): any[] {
  // 这个函数现在只是占位，实际的命宫索引会在组件中重新计算
  return [
    {
      centerPalace: 0, // 占位值，会在组件中重新计算
      relatedPalaces: [0, 4, 8, 6], // 占位值，会在组件中重新计算
      groupType: "命宫三方四正",
    },
  ];
}

// 临时辅助函数：生成四化盘数据
function generateSihuaDisplay(palaces: any[]): any {
  const sihua: { lu: any[]; quan: any[]; ke: any[]; ji: any[] } = {
    lu: [],
    quan: [],
    ke: [],
    ji: [],
  };
  palaces.forEach((palace) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    allStars.forEach((star: any) => {
      if (star.mutagen) {
        switch (star.mutagen) {
          case "禄":
            sihua.lu.push(star);
            break;
          case "权":
            sihua.quan.push(star);
            break;
          case "科":
            sihua.ke.push(star);
            break;
          case "忌":
            sihua.ji.push(star);
            break;
        }
      }
    });
  });
  return sihua;
}
