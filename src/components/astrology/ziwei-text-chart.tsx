"use client";

import React from "react";
import type { IztroChart, Palace, Star } from "./ziwei-types";

interface ZiweiTextChartProps {
  chartData: IztroChart;
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

/**
 * 以文字形式详细展示紫微斗数排盘结果的组件
 * @param {ZiweiTextChartProps} props - 包含命盘数据的 props
 * @returns {React.ReactElement} - 文字版排盘结果的 JSX 元素
 */
export const ZiweiTextChart: React.FC<ZiweiTextChartProps> = ({
  chartData,
}) => {
  return (
    <div className="card card-bordered bg-base-100 shadow-md p-6">
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
        <h3 className="text-xl font-bold text-center mb-4">十二宫位详情</h3>
        <div className="space-y-4">
          {/* 按宫位顺序 (index 0 to 11) 排序并渲染 */}
          {[...chartData.palaces]
            .sort((a, b) => a.index - b.index)
            .map((palace: Palace) => (
              <div key={palace.name} className="p-3 bg-base-200 rounded-lg">
                <h4 className="text-lg font-bold mb-2">
                  {palace.name} ({palace.heavenlyStem}
                  {palace.earthlyBranch})
                  {palace.isBodyPalace && (
                    <span className="text-primary ml-2 font-normal text-sm badge badge-primary">
                      身宫
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm">
                  <p>
                    <span className="font-semibold w-16 inline-block">
                      主星:
                    </span>{" "}
                    {formatStars(palace.majorStars)}
                  </p>
                  <p>
                    <span className="font-semibold w-16 inline-block">
                      辅星/煞星:
                    </span>{" "}
                    {formatStars(palace.minorStars)}
                  </p>
                  <p>
                    <span className="font-semibold w-16 inline-block">
                      杂曜:
                    </span>{" "}
                    {formatStars(palace.adjectiveStars)}
                  </p>
                  <p>
                    <span className="font-semibold w-16 inline-block">
                      大限:
                    </span>{" "}
                    {palace.decadal.range.join("-")} 岁
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
