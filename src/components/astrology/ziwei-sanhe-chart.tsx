"use client";

import React from "react";
import type { ExtendedIztroChart, SanheGroup } from "./ziwei-types";
import { ZiweiPalace } from "./ziwei-palace";

interface ZiweiSanheChartProps {
  chartData: ExtendedIztroChart;
}

/**
 * 三合盘组件 - 专门显示三方四正关系
 * 特点：突出显示三合四正的宫位组合和呼应关系
 */
export const ZiweiSanheChart: React.FC<ZiweiSanheChartProps> = ({
  chartData,
}) => {
  // 渲染三合关系说明
  const renderSanheExplanation = () => {
    const soulIndex = getBranchIndex(chartData.earthlyBranchOfSoulPalace);
    const palaceNames = [
      "命宫",
      "兄弟宫",
      "夫妻宫",
      "子女宫",
      "财帛宫",
      "疾厄宫",
      "迁移宫",
      "奴仆宫",
      "官禄宫",
      "田宅宫",
      "福德宫",
      "父母宫",
    ];

    const sanheRelations = [
      {
        center: palaceNames[soulIndex],
        related: [
          palaceNames[soulIndex], // 命宫
          palaceNames[(soulIndex + 4) % 12], // 官禄宫
          palaceNames[(soulIndex + 8) % 12], // 财帛宫
          palaceNames[(soulIndex + 6) % 12], // 迁移宫
        ],
        description: "命宫三方四正 - 主格局",
      },
      {
        center: palaceNames[(soulIndex + 1) % 12], // 兄弟宫
        related: [
          palaceNames[(soulIndex + 1) % 12], // 兄弟宫
          palaceNames[(soulIndex + 5) % 12], // 疾厄宫
          palaceNames[(soulIndex + 9) % 12], // 奴仆宫
          palaceNames[(soulIndex + 7) % 12], // 奴仆宫对宫
        ],
        description: "兄弟宫三方四正 - 人际关系",
      },
    ];

    return (
      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-800 mb-3">
          三方四正关系
        </h4>
        <div className="space-y-3 text-sm">
          {sanheRelations.map((relation, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded border border-purple-100"
            >
              <div className="font-medium text-purple-700 mb-2">
                {relation.description}
              </div>
              <div className="flex flex-wrap gap-2">
                {relation.related.map((palace, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs ${
                      idx === 0
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {palace}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染三合连线
  const renderSanheConnections = () => {
    if (!chartData.sanheGroups || chartData.sanheGroups.length === 0) {
      return null;
    }

    return chartData.sanheGroups.map((group, groupIndex) => {
      return group.relatedPalaces.map((palaceIndex, lineIndex) => {
        if (lineIndex === 0) return null; // 不连接中心宫位到自己

        return (
          <div
            key={`sanhe-line-${groupIndex}-${lineIndex}`}
            className="ziwei-sanhe-connection"
            style={calculateConnectionStyle(group.centerPalace, palaceIndex)}
            title={`三方四正关系: ${group.groupType}`}
          />
        );
      });
    });
  };

  return (
    <div className="ziwei-sanhe-chart-container">
      {renderSanheExplanation()}

      <div className="ziwei-astrolabe ziwei-sanhe-chart">
        {/* 渲染12个宫位 */}
        {Array.from({ length: 12 }, (_, palaceIndex) => {
          const palace = chartData.palaces[palaceIndex];
          if (!palace) return null;

          return (
            <ZiweiPalace
              key={`sanhe-palace-${palaceIndex}`}
              palace={palace}
              index={palaceIndex}
              soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
              bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
              chartType="sanhe"
              extendedData={chartData}
            />
          );
        })}

        {/* 中心区域 - 显示三合说明 */}
        <div className="ziwei-center-area">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 text-center rounded-lg border border-purple-200 w-full h-full flex flex-col justify-center">
            <div className="text-lg font-bold text-purple-800 mb-4">
              🔮 三合盘
            </div>
            <div className="text-sm text-purple-700 space-y-2">
              <div>🎭 三方四正组合</div>
              <div>🔗 宫位呼应关系</div>
              <div>⚖️ 格局平衡分析</div>
            </div>
          </div>
        </div>

        {/* 三合连线 */}
        {renderSanheConnections()}
      </div>
    </div>
  );
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

// 辅助函数：计算连线样式
function calculateConnectionStyle(
  centerPalace: number,
  targetPalace: number
): React.CSSProperties {
  // 简化实现，后续可以根据实际布局优化
  const distance = Math.abs(targetPalace - centerPalace);
  const opacity = distance > 6 ? 0.6 : 0.8;

  return {
    opacity,
    // 这里需要根据实际的宫位位置计算精确的连线路径
    // 暂时使用简化的样式
  };
}
