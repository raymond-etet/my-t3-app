"use client";

import React, { useState } from "react";
import type {
  IztroChart,
  Palace,
  Star,
  ChartType,
  ExtendedIztroChart,
} from "./ziwei-types";

interface ZiweiTextChartProps {
  chartData: IztroChart | ExtendedIztroChart;
}

/**
 * 渲染星曜信息的辅助函数
 * @param {Star[]} stars - 星曜数组
 * @returns {string} - 格式化后的星曜字符串
 */
const formatStars = (stars: Star[]): string => {
  if (!stars || stars.length === 0) {
    return "无";
  }
  return stars
    .map((star) => {
      let starInfo = star.name;
      if (star.brightness) {
        starInfo += `(${star.brightness})`;
      }
      if (star.mutagen) {
        starInfo += `[${star.mutagen}]`;
      }
      return starInfo;
    })
    .join(" ");
};

// 辅助函数：获取地支对应的索引
function getBranchIndex(branch: string): number {
  const branchMap: { [key: string]: number } = {
    子: 0,
    丑: 1,
    寅: 2,
    卯: 3,
    辰: 4,
    巳: 5,
    午: 6,
    未: 7,
    申: 8,
    酉: 9,
    戌: 10,
    亥: 11,
  };
  return branchMap[branch] || 0;
}

/**
 * 以文字形式详细展示紫微斗数排盘结果的组件
 * @param {ZiweiTextChartProps} props - 包含命盘数据的 props
 * @returns {React.ReactElement} - 文字版排盘结果的 JSX 元素
 */
export const ZiweiTextChart: React.FC<ZiweiTextChartProps> = ({
  chartData,
}) => {
  const [chartType, setChartType] = useState<ChartType>("standard");

  // 检查是否为扩展数据
  const isExtendedChart = (data: any): data is ExtendedIztroChart => {
    return data && typeof data === "object" && "flyingStars" in data;
  };

  const extendedData = isExtendedChart(chartData) ? chartData : null;

  // 根据排盘类型渲染不同的宫位信息
  const renderPalaceContent = (palace: Palace, index: number) => {
    switch (chartType) {
      case "flying":
        return renderFlyingPalaceContent(palace, index);
      case "sanhe":
        return renderSanhePalaceContent(palace, index);
      case "sihua":
        return renderSihuaPalaceContent(palace, index);
      default:
        return renderStandardPalaceContent(palace);
    }
  };

  // 标准盘宫位内容
  const renderStandardPalaceContent = (palace: Palace) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm">
      <p>
        <span className="font-semibold w-16 inline-block">主星:</span>{" "}
        {formatStars(palace.majorStars)}
      </p>
      <p>
        <span className="font-semibold w-16 inline-block">辅星/煞星:</span>{" "}
        {formatStars(palace.minorStars)}
      </p>
      <p>
        <span className="font-semibold w-16 inline-block">杂曜:</span>{" "}
        {formatStars(palace.adjectiveStars)}
      </p>
      <p>
        <span className="font-semibold w-16 inline-block">大限:</span>{" "}
        {palace.decadal.range.join("-")} 岁
      </p>
    </div>
  );

  // 飞星盘宫位内容
  const renderFlyingPalaceContent = (palace: Palace, index: number) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    const sihuaStars = allStars.filter((star) => star.mutagen);
    const normalStars = allStars.filter((star) => !star.mutagen);

    return (
      <div className="grid grid-cols-1 gap-x-4 text-sm">
        <p>
          <span className="font-semibold w-16 inline-block text-amber-700">
            四化星:
          </span>{" "}
          {sihuaStars.length > 0 ? formatStars(sihuaStars) : "无"}
        </p>
        <p>
          <span className="font-semibold w-16 inline-block">其他星:</span>{" "}
          {normalStars.length > 0 ? formatStars(normalStars.slice(0, 3)) : "无"}
          {normalStars.length > 3 && <span className="text-gray-500">...</span>}
        </p>
      </div>
    );
  };

  // 三合盘宫位内容
  const renderSanhePalaceContent = (palace: Palace, index: number) => {
    const soulIndex = getBranchIndex(
      chartData.earthlyBranchOfSoulPalace || "子"
    );
    const isMainTriad = [
      soulIndex,
      (soulIndex + 4) % 12,
      (soulIndex + 8) % 12,
      (soulIndex + 6) % 12,
    ].includes(index);

    return (
      <div className="grid grid-cols-1 gap-x-4 text-sm">
        {isMainTriad && (
          <p className="text-purple-600 font-medium mb-1">★ 命宫三方四正</p>
        )}
        <p>
          <span className="font-semibold w-16 inline-block">主要星曜:</span>{" "}
          {formatStars([
            ...palace.majorStars,
            ...palace.minorStars.slice(0, 2),
          ])}
        </p>
        <p>
          <span className="font-semibold w-16 inline-block">大限:</span>{" "}
          {palace.decadal.range.join("-")} 岁
        </p>
      </div>
    );
  };

  // 四化盘宫位内容
  const renderSihuaPalaceContent = (palace: Palace, index: number) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    const sihuaStars = allStars.filter((star) => star.mutagen);

    if (sihuaStars.length === 0) {
      return <div className="text-sm text-gray-500 italic">本宫无四化星曜</div>;
    }

    const luStars = sihuaStars.filter((star) => star.mutagen === "禄");
    const quanStars = sihuaStars.filter((star) => star.mutagen === "权");
    const keStars = sihuaStars.filter((star) => star.mutagen === "科");
    const jiStars = sihuaStars.filter((star) => star.mutagen === "忌");

    return (
      <div className="grid grid-cols-1 gap-y-2 text-sm">
        {luStars.length > 0 && (
          <p>
            <span className="bg-red-500 text-white px-1 rounded text-xs">
              禄
            </span>{" "}
            {formatStars(luStars)}
          </p>
        )}
        {quanStars.length > 0 && (
          <p>
            <span className="bg-blue-500 text-white px-1 rounded text-xs">
              权
            </span>{" "}
            {formatStars(quanStars)}
          </p>
        )}
        {keStars.length > 0 && (
          <p>
            <span className="bg-green-500 text-white px-1 rounded text-xs">
              科
            </span>{" "}
            {formatStars(keStars)}
          </p>
        )}
        {jiStars.length > 0 && (
          <p>
            <span className="bg-gray-700 text-white px-1 rounded text-xs">
              忌
            </span>{" "}
            {formatStars(jiStars)}
          </p>
        )}
      </div>
    );
  };

  // 渲染排盘类型说明
  const renderChartTypeDescription = () => {
    switch (chartType) {
      case "flying":
        return (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
            <span className="font-semibold text-amber-800">
              ✨ 飞星盘说明：
            </span>
            <span className="text-amber-700">
              重点显示四化星曜的分布情况，其他星曜简化显示
            </span>
          </div>
        );
      case "sanhe":
        return (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
            <span className="font-semibold text-purple-800">
              🔮 三合盘说明：
            </span>
            <span className="text-purple-700">
              突出显示命宫三方四正的宫位组合和呼应关系
            </span>
          </div>
        );
      case "sihua":
        return (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
            <span className="font-semibold text-green-800">
              ⚡ 四化盘说明：
            </span>
            <span className="text-green-700">
              专门显示四化星曜，非四化星曜不显示
            </span>
          </div>
        );
      default:
        return (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <span className="font-semibold text-blue-800">📊 标准盘说明：</span>
            <span className="text-blue-700">完整显示所有星曜和宫位信息</span>
          </div>
        );
    }
  };

  return (
    <div className="card card-bordered bg-base-100 shadow-md p-6">
      {/* 排盘类型选择器 */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">文字排盘结果</h3>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType("standard")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === "standard"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              标准盘
            </button>
            <button
              onClick={() => setChartType("flying")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === "flying"
                  ? "bg-amber-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              飞星盘
            </button>
            <button
              onClick={() => setChartType("sanhe")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === "sanhe"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              三合盘
            </button>
            <button
              onClick={() => setChartType("sihua")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === "sihua"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              四化盘
            </button>
          </div>
        </div>

        {renderChartTypeDescription()}
      </div>

      <div className="mb-6 pb-4 border-b">
        <h3 className="text-xl font-bold text-center mb-4">基本信息</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <p>
            <span className="font-semibold">阳历:</span> {chartData.solarDate}
          </p>
          <p>
            <span className="font-semibold">农历:</span> {chartData.lunarDate}
          </p>
          <p>
            <span className="font-semibold">干支:</span> {chartData.chineseDate}
          </p>
          <p>
            <span className="font-semibold">性别:</span> {chartData.gender}
          </p>
          <p>
            <span className="font-semibold">五行局:</span>{" "}
            {chartData.fiveElementsClass}
          </p>
          <p>
            <span className="font-semibold">命主:</span> {chartData.soul}
          </p>
          <p>
            <span className="font-semibold">身主:</span> {chartData.body}
          </p>
          <p>
            <span className="font-semibold">时辰:</span> {chartData.time} (
            {chartData.timeRange})
          </p>
          <p>
            <span className="font-semibold">星座:</span> {chartData.sign}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-center mb-4">
          十二宫位详情 {chartType === "sihua" && "(仅显示有四化星的宫位)"}
        </h3>
        <div className="space-y-4">
          {/* 按宫位顺序 (index 0 to 11) 排序并渲染 */}
          {[...chartData.palaces]
            .sort((a, b) => a.index - b.index)
            .filter((palace: Palace) => {
              // 四化盘模式下只显示有四化星的宫位
              if (chartType === "sihua") {
                const allStars = [
                  ...palace.majorStars,
                  ...palace.minorStars,
                  ...palace.adjectiveStars,
                ];
                return allStars.some((star) => star.mutagen);
              }
              return true;
            })
            .map((palace: Palace) => (
              <div
                key={palace.name}
                className={`p-3 rounded-lg ${
                  chartType === "flying"
                    ? "bg-amber-50 border border-amber-200"
                    : chartType === "sanhe"
                    ? "bg-purple-50 border border-purple-200"
                    : chartType === "sihua"
                    ? "bg-green-50 border border-green-200"
                    : "bg-base-200"
                }`}
              >
                <h4
                  className={`text-lg font-bold mb-2 ${
                    chartType === "flying"
                      ? "text-amber-800"
                      : chartType === "sanhe"
                      ? "text-purple-800"
                      : chartType === "sihua"
                      ? "text-green-800"
                      : ""
                  }`}
                >
                  {palace.name} ({palace.heavenlyStem}
                  {palace.earthlyBranch})
                  {palace.isBodyPalace && (
                    <span className="text-primary ml-2 font-normal text-sm badge badge-primary">
                      身宫
                    </span>
                  )}
                </h4>
                {renderPalaceContent(palace, palace.index)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
