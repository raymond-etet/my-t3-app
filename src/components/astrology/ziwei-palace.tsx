"use client";

import React from "react";
import type { Palace } from "./ziwei-types"; // 引入将在下一步创建的类型文件
// 定义组件的 props 类型，它接收一个宫位对象和索引
interface ZiweiPalaceProps {
  palace: Palace;
  index: number;
  soulPalaceBranch?: string; // 接收命宫地支用于高亮
  bodyPalaceBranch?: string; // 接收身宫地支用于高亮
}

/**
 * 渲染单个宫位的组件
 * @param {ZiweiPalaceProps} props - 包含宫位数据和索引的 props
 * @returns {React.ReactElement} - 单个宫位的 JSX 元素
 */
export const ZiweiPalace: React.FC<ZiweiPalaceProps> = ({
  palace,
  index,
  soulPalaceBranch,
  bodyPalaceBranch,
}) => {
  // 判断当前宫位是否为命宫
  const isSoulPalace = palace.earthlyBranch === soulPalaceBranch;
  // 判断当前宫位是否为身宫
  const isBodyPalace = palace.earthlyBranch === bodyPalaceBranch;

  // 渲染星曜的辅助函数，增强四化显示
  const renderStars = (stars: Palace["majorStars"], className: string = "") => {
    if (!stars || stars.length === 0) {
      return <span className="text-gray-400 text-xs">无</span>;
    }

    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {stars.map((star, idx) => (
          <span
            key={`${star.name}-${idx}`}
            className="inline-flex items-center"
          >
            <span className="star-name">{star.name}</span>
            {star.brightness && (
              <span className="text-xs text-gray-500 ml-1">
                ({star.brightness})
              </span>
            )}
            {star.mutagen && (
              <span
                className={`ziwei-star-mutagen ${getMutagenClass(
                  star.mutagen
                )}`}
              >
                {star.mutagen}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  // 获取四化样式类名的辅助函数
  const getMutagenClass = (mutagen: string): string => {
    switch (mutagen) {
      case "禄":
        return "lu";
      case "权":
        return "quan";
      case "科":
        return "ke";
      case "忌":
        return "ji";
      default:
        return "";
    }
  };

  return (
    <div
      className={`ziwei-palace-card ${
        isBodyPalace ? "ziwei-body-palace" : ""
      } ${isSoulPalace ? "ziwei-soul-palace" : ""}`}
      data-palace={index}
    >
      {/* 宫位标题区域 */}
      <div className="ziwei-palace-header">
        <h3 className="font-bold text-sm text-gray-800">
          {palace.name}
          {/* 如果是命宫，显示 "(命)" */}
          {isSoulPalace && <span className="text-blue-500 ml-1">(命)</span>}
          {/* 如果是身宫，显示 "(身)" */}
          {isBodyPalace && <span className="text-red-500 ml-1">(身)</span>}
        </h3>
        <div className="text-xs text-gray-500">
          {palace.decadal.range.join("-")}岁
        </div>
      </div>

      {/* 星曜显示区域 - 分层显示 */}
      <div className="ziwei-palace-stars">
        {/* 主星区域 */}
        <div className="ziwei-major-stars">
          {renderStars(palace.majorStars, "ziwei-major-stars")}
        </div>

        {/* 辅星区域 */}
        <div className="ziwei-minor-stars">
          {renderStars(palace.minorStars, "ziwei-minor-stars")}
        </div>

        {/* 杂曜区域 */}
        <div className="ziwei-adjective-stars">
          {renderStars(palace.adjectiveStars, "ziwei-adjective-stars")}
        </div>
      </div>

      {/* 宫位底部信息：天干地支 */}
      <div className="ziwei-palace-footer">
        <span className="text-gray-600">{palace.heavenlyStem}</span>
        <span className="font-bold text-gray-800">{palace.earthlyBranch}</span>
      </div>
    </div>
  );
};
