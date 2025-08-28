"use client";

import React from "react";
import type { ExtendedIztroChart, SihuaDisplay, Star } from "./ziwei-types";
import { ZiweiPalace } from "./ziwei-palace";

interface ZiweiSihuaChartProps {
  chartData: ExtendedIztroChart;
}

/**
 * 四化盘组件 - 专门显示四化系统
 * 特点：只显示或强调带四化的星曜，简化显示，专注四化关系
 */
export const ZiweiSihuaChart: React.FC<ZiweiSihuaChartProps> = ({
  chartData,
}) => {
  // 渲染四化统计面板
  const renderSihuaPanel = () => {
    if (!chartData.sihuaDisplay) return null;

    const { lu, quan, ke, ji } = chartData.sihuaDisplay;

    return (
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-lg font-semibold text-green-800 mb-3">
          四化星曜分布
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 化禄 */}
          <div className="bg-white p-3 rounded border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <span className="ziwei-star-mutagen lu text-white px-2 py-1 rounded text-sm">
                禄
              </span>
              <span className="text-xs text-gray-500">{lu.length} 个</span>
            </div>
            <div className="space-y-1">
              {lu.slice(0, 3).map((star, index) => (
                <div key={index} className="text-xs text-gray-700">
                  {star.name}
                </div>
              ))}
              {lu.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{lu.length - 3} 个...
                </div>
              )}
            </div>
          </div>

          {/* 化权 */}
          <div className="bg-white p-3 rounded border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="ziwei-star-mutagen quan text-white px-2 py-1 rounded text-sm">
                权
              </span>
              <span className="text-xs text-gray-500">{quan.length} 个</span>
            </div>
            <div className="space-y-1">
              {quan.slice(0, 3).map((star, index) => (
                <div key={index} className="text-xs text-gray-700">
                  {star.name}
                </div>
              ))}
              {quan.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{quan.length - 3} 个...
                </div>
              )}
            </div>
          </div>

          {/* 化科 */}
          <div className="bg-white p-3 rounded border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="ziwei-star-mutagen ke text-white px-2 py-1 rounded text-sm">
                科
              </span>
              <span className="text-xs text-gray-500">{ke.length} 个</span>
            </div>
            <div className="space-y-1">
              {ke.slice(0, 3).map((star, index) => (
                <div key={index} className="text-xs text-gray-700">
                  {star.name}
                </div>
              ))}
              {ke.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{ke.length - 3} 个...
                </div>
              )}
            </div>
          </div>

          {/* 化忌 */}
          <div className="bg-white p-3 rounded border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="ziwei-star-mutagen ji text-white px-2 py-1 rounded text-sm">
                忌
              </span>
              <span className="text-xs text-gray-500">{ji.length} 个</span>
            </div>
            <div className="space-y-1">
              {ji.slice(0, 3).map((star, index) => (
                <div key={index} className="text-xs text-gray-700">
                  {star.name}
                </div>
              ))}
              {ji.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{ji.length - 3} 个...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 四化平衡度分析 */}
        <div className="mt-4 p-3 bg-green-100 rounded">
          <div className="text-sm font-medium text-green-800 mb-1">
            四化平衡度
          </div>
          <div className="text-xs text-green-700">
            禄权科忌分布：{lu.length}:{quan.length}:{ke.length}:{ji.length}
            {getSihuaBalanceComment(
              lu.length,
              quan.length,
              ke.length,
              ji.length
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ziwei-sihua-chart-container">
      {renderSihuaPanel()}

      <div className="ziwei-astrolabe ziwei-sihua-chart">
        {/* 渲染12个宫位 */}
        {Array.from({ length: 12 }, (_, palaceIndex) => {
          const palace = chartData.palaces[palaceIndex];
          if (!palace) return null;

          return (
            <ZiweiPalace
              key={`sihua-palace-${palaceIndex}`}
              palace={palace}
              index={palaceIndex}
              soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
              bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
              chartType="sihua"
              extendedData={chartData}
            />
          );
        })}

        {/* 中心区域 - 显示四化说明 */}
        <div className="ziwei-center-area">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center rounded-lg border border-green-200 w-full h-full flex flex-col justify-center">
            <div className="text-lg font-bold text-green-800 mb-4">
              ⚡ 四化盘
            </div>
            <div className="text-sm text-green-700 space-y-2">
              <div>🎯 专注四化星曜</div>
              <div>⚖️ 分析四化平衡</div>
              <div>🔍 简化显示模式</div>
            </div>

            {/* 四化比例环形图（简化版） */}
            <div className="mt-4">
              <div className="text-xs text-green-600 mb-2">四化分布</div>
              <div className="flex justify-center space-x-1">
                {renderSihuaDotsIndicator()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 辅助函数：渲染四化点状指示器
function renderSihuaDotsIndicator() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-red-500 rounded-full" title="化禄"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full" title="化权"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full" title="化科"></div>
      <div className="w-2 h-2 bg-gray-700 rounded-full" title="化忌"></div>
    </div>
  );
}

// 辅助函数：分析四化平衡度并给出评语
function getSihuaBalanceComment(
  luCount: number,
  quanCount: number,
  keCount: number,
  jiCount: number
): string {
  const total = luCount + quanCount + keCount + jiCount;
  if (total === 0) return " - 暂无四化星";

  const maxCount = Math.max(luCount, quanCount, keCount, jiCount);
  const minCount = Math.min(luCount, quanCount, keCount, jiCount);

  if (maxCount - minCount <= 1) {
    return " - 四化分布均衡";
  } else if (jiCount > luCount + quanCount + keCount) {
    return " - 忌星偏多，需注意化解";
  } else if (luCount > quanCount + keCount + jiCount) {
    return " - 禄星丰富，财运较佳";
  } else {
    return " - 四化分布有偏，需综合分析";
  }
}
