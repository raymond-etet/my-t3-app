"use client";

import React from "react";
import type { ExtendedIztroChart } from "./ziwei-types";

interface ZiweiSanheLinesProps {
  chartData: ExtendedIztroChart;
  showLines?: boolean;
}

/**
 * 三方四正连线组件
 * 负责绘制宫位之间的三方四正关系连线
 */
export const ZiweiSanheLines: React.FC<ZiweiSanheLinesProps> = ({
  chartData,
  showLines = true,
}) => {
  if (!showLines || !chartData.sanheGroups) {
    return null;
  }

  // 宫位在网格中的位置映射 - 根据CSS grid-template-areas布局
  // "g3 g4 g5 g6"
  // "g2 ct ct g7"
  // "g1 ct ct g8"
  // "g0 g11 g10 g9"
  const palacePositions = {
    0: { row: 3, col: 0 }, // g0 - 命宫（左下角）
    1: { row: 2, col: 0 }, // g1 - 兄弟宫
    2: { row: 1, col: 0 }, // g2 - 夫妻宫
    3: { row: 0, col: 0 }, // g3 - 子女宫（左上角）
    4: { row: 0, col: 1 }, // g4 - 财帛宫
    5: { row: 0, col: 2 }, // g5 - 疾厄宫
    6: { row: 0, col: 3 }, // g6 - 迁移宫（右上角）
    7: { row: 1, col: 3 }, // g7 - 奴仆宫
    8: { row: 2, col: 3 }, // g8 - 官禄宫
    9: { row: 3, col: 3 }, // g9 - 田宅宫（右下角）
    10: { row: 3, col: 2 }, // g10 - 福德宫
    11: { row: 3, col: 1 }, // g11 - 父母宫
  };

  // 找到命宫的实际索引
  const findSoulPalaceIndex = (): number => {
    for (let i = 0; i < chartData.palaces.length; i++) {
      const palace = chartData.palaces[i];
      if (
        palace &&
        palace.earthlyBranch === chartData.earthlyBranchOfSoulPalace
      ) {
        return i;
      }
    }
    return 0;
  };

  return (
    <div className="ziwei-sanhe-connections">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {renderSVGLines()}
      </svg>
    </div>
  );

  // 使用SVG绘制更精确的连线
  function renderSVGLines() {
    const soulIndex = findSoulPalaceIndex();
    const sanfangsizheng = [
      (soulIndex + 6) % 12, // 迁移宫（对宫）
      (soulIndex + 8) % 12, // 财帛宫（三合之一）
      (soulIndex + 4) % 12, // 事业宫/官禄宫（三合之二）
    ];

    return sanfangsizheng.map((targetPalace, index) => {
      const from = palacePositions[soulIndex as keyof typeof palacePositions];
      const to = palacePositions[targetPalace as keyof typeof palacePositions];

      if (!from || !to) return null;

      // 计算SVG坐标（百分比转换为SVG坐标）
      const fromX = from.col * 25 + 12.5; // 25% per column + center offset
      const fromY = from.row * 25 + 12.5; // 25% per row + center offset
      const toX = to.col * 25 + 12.5;
      const toY = to.row * 25 + 12.5;

      return (
        <line
          key={`svg-line-${index}`}
          x1={`${fromX}%`}
          y1={`${fromY}%`}
          x2={`${toX}%`}
          y2={`${toY}%`}
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="5,3"
          opacity="0.8"
        >
          <title>
            三方四正: {getPalaceName(soulIndex)} → {getPalaceName(targetPalace)}
          </title>
        </line>
      );
    });
  }
};

// 辅助函数：获取宫位名称
function getPalaceName(palaceIndex: number): string {
  const palaceNames = [
    "命宫",
    "兄弟宫",
    "夫妻宫",
    "子女宫",
    "财帛宫",
    "疾厄宫",
    "迁移宫",
    "奴仆宫",
    "事业宫", // 官禄宫也叫事业宫
    "田宅宫",
    "福德宫",
    "父母宫",
  ];
  return palaceNames[palaceIndex] || `宫位${palaceIndex}`;
}
