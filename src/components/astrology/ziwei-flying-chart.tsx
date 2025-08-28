"use client";

import React from "react";
import type { ExtendedIztroChart, FlyingStarData } from "./ziwei-types";
import { ZiweiPalace } from "./ziwei-palace";

interface ZiweiFlyingChartProps {
  chartData: ExtendedIztroChart;
}

/**
 * 飞星盘组件 - 专门显示四化飞星关系
 * 特点：突出显示四化星的飞化关系和流向
 */
export const ZiweiFlyingChart: React.FC<ZiweiFlyingChartProps> = ({
  chartData,
}) => {
  // 渲染飞星连线
  const renderFlyingStarConnections = () => {
    if (!chartData.flyingStars || chartData.flyingStars.length === 0) {
      return null;
    }

    return chartData.flyingStars.map((flyingStar, index) => {
      if (flyingStar.fromPalace === flyingStar.toPalace) {
        return null; // 同宫位不需要连线
      }

      return (
        <div
          key={`flying-line-${index}`}
          className="ziwei-flying-arrow"
          style={calculateArrowStyle(
            flyingStar.fromPalace,
            flyingStar.toPalace
          )}
          title={`${flyingStar.starName}${flyingStar.mutagen} 飞入`}
        />
      );
    });
  };

  // 渲染四化统计信息
  const renderFlyingStarSummary = () => {
    const mutageStats = { 禄: 0, 权: 0, 科: 0, 忌: 0 };

    chartData.flyingStars?.forEach((star) => {
      if (star.mutagen in mutageStats) {
        mutageStats[star.mutagen as keyof typeof mutageStats]++;
      }
    });

    return (
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="text-lg font-semibold text-amber-800 mb-2">飞星概况</h4>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="ziwei-star-mutagen lu text-white px-2 py-1 rounded">
              禄
            </div>
            <div className="mt-1 text-gray-600">{mutageStats.禄} 个</div>
          </div>
          <div className="text-center">
            <div className="ziwei-star-mutagen quan text-white px-2 py-1 rounded">
              权
            </div>
            <div className="mt-1 text-gray-600">{mutageStats.权} 个</div>
          </div>
          <div className="text-center">
            <div className="ziwei-star-mutagen ke text-white px-2 py-1 rounded">
              科
            </div>
            <div className="mt-1 text-gray-600">{mutageStats.科} 个</div>
          </div>
          <div className="text-center">
            <div className="ziwei-star-mutagen ji text-white px-2 py-1 rounded">
              忌
            </div>
            <div className="mt-1 text-gray-600">{mutageStats.忌} 个</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ziwei-flying-chart-container">
      {renderFlyingStarSummary()}

      <div className="ziwei-astrolabe ziwei-flying-chart">
        {/* 渲染12个宫位 */}
        {Array.from({ length: 12 }, (_, palaceIndex) => {
          const palace = chartData.palaces[palaceIndex];
          if (!palace) return null;

          return (
            <ZiweiPalace
              key={`flying-palace-${palaceIndex}`}
              palace={palace}
              index={palaceIndex}
              soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
              bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
              chartType="flying"
              extendedData={chartData}
            />
          );
        })}

        {/* 中心区域 - 显示飞星说明 */}
        <div className="ziwei-center-area">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center rounded-lg border border-orange-200 w-full h-full flex flex-col justify-center">
            <div className="text-lg font-bold text-orange-800 mb-4">
              ✨ 飞星盘
            </div>
            <div className="text-sm text-orange-700 space-y-2">
              <div>🎯 重点关注四化星</div>
              <div>🔄 显示飞化关系</div>
              <div>📍 高亮四化宫位</div>
            </div>
          </div>
        </div>

        {/* 飞星连线 */}
        {renderFlyingStarConnections()}
      </div>
    </div>
  );
};

// 辅助函数：计算飞星连线样式
function calculateArrowStyle(
  fromPalace: number,
  toPalace: number
): React.CSSProperties {
  // 简化实现，后续可以根据实际宫位布局优化
  const angle = ((toPalace - fromPalace) * 30) % 360;

  return {
    transform: `rotate(${angle}deg)`,
    transformOrigin: "center",
    // 这里需要根据实际的宫位位置计算精确的坐标
    // 暂时使用简化的样式
  };
}
