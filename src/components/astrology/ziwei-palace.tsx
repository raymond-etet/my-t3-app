"use client";

import React from "react";
import type { Palace, ChartType, ExtendedIztroChart } from "./ziwei-types"; // 引入将在下一步创建的类型文件
// 定义组件的 props 类型，它接收一个宫位对象和索引
interface ZiweiPalaceProps {
  palace: Palace;
  index: number;
  soulPalaceBranch?: string; // 接收命宫地支用于高亮
  bodyPalaceBranch?: string; // 接收身宫地支用于高亮
  chartType?: ChartType; // 排盘类型
  extendedData?: ExtendedIztroChart; // 扩展数据
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
  chartType = "standard",
  extendedData,
}) => {
  // 判断当前宫位是否为命宫
  const isSoulPalace = palace.earthlyBranch === soulPalaceBranch;
  // 判断当前宫位是否为身宫
  const isBodyPalace = palace.earthlyBranch === bodyPalaceBranch;

  // 获取星曜亮度对应的CSS类
  const getBrightnessClass = (brightness?: string): string => {
    if (!brightness) return "star-brightness-neutral";

    switch (brightness) {
      case "庙":
        return "star-brightness-temple";
      case "旺":
        return "star-brightness-prosperous";
      case "得":
      case "利":
        return "star-brightness-favorable";
      case "平":
        return "star-brightness-neutral";
      case "陷":
      case "不":
        return "star-brightness-weak";
      default:
        return "star-brightness-neutral";
    }
  };

  // 获取星曜类型对应的CSS类（根据星曜名称判断好坏）
  const getStarTypeClass = (starName: string): string => {
    // 吉星
    const goodStars = [
      "紫微",
      "天府",
      "太阳",
      "太阴",
      "天机",
      "天同",
      "天相",
      "天梁",
      "文昌",
      "文曲",
      "左辅",
      "右弼",
      "天魁",
      "天钺",
      "禄存",
      "天马",
      "三台",
      "八座",
      "恩光",
      "天贵",
      "台辅",
      "封诰",
      "天官",
      "天福",
      "凤阁",
      "龙池",
    ];

    // 煞星
    const badStars = [
      "擎羊",
      "陀罗",
      "火星",
      "铃星",
      "地空",
      "地劫",
      "天刑",
      "天姚",
      "阴煞",
      "天哭",
      "天虚",
      "大耗",
      "小耗",
      "破碎",
      "蜚廉",
      "病符",
      "丧门",
      "贯索",
      "官符",
      "五鬼",
      "死符",
      "岁破",
      "龙德",
      "白虎",
      "天德",
      "吊客",
      "灾煞",
    ];

    if (goodStars.includes(starName)) {
      return "star-type-good";
    } else if (badStars.includes(starName)) {
      return "star-type-bad";
    }
    return "star-type-neutral";
  };

  // 渲染星曜的辅助函数，增强四化显示和颜色区分
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
            <span
              className={`star-name ${getBrightnessClass(
                star.brightness
              )} ${getStarTypeClass(star.name)}`}
            >
              {star.name}
              {star.brightness && (
                <span className="text-xs ml-0.5">{star.brightness}</span>
              )}
            </span>
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

  // 渲染主星曜的辅助函数，带背景色
  const renderStarsWithBackground = (
    stars: Palace["majorStars"],
    className: string = ""
  ) => {
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
            <span
              className={`star-name px-2 py-1 rounded text-white font-bold text-sm ${
                star.brightness === "庙"
                  ? "bg-red-600"
                  : star.brightness === "旺"
                  ? "bg-orange-500"
                  : star.brightness === "得" || star.brightness === "利"
                  ? "bg-green-500"
                  : star.brightness === "陷" || star.brightness === "不"
                  ? "bg-gray-400"
                  : "bg-blue-500"
              }`}
            >
              {star.name}
              {star.brightness && (
                <span className="text-xs ml-1">{star.brightness}</span>
              )}
            </span>
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
      } ${isSoulPalace ? "ziwei-soul-palace" : ""} ${getChartTypeHighlight(
        chartType,
        index,
        extendedData
      )}`}
      data-palace={index}
    >
      {/* 上半部：星曜显示区域 */}
      <div className="ziwei-palace-stars-upper flex-1">
        {/* 主星区域 - 带背景色 */}
        <div className="ziwei-major-stars mb-1">
          {renderStarsWithBackground(palace.majorStars, "ziwei-major-stars")}
        </div>

        {/* 辅星区域 */}
        <div className="ziwei-minor-stars mb-1">
          {renderStars(palace.minorStars, "ziwei-minor-stars")}
        </div>

        {/* 杂曜区域 */}
        <div className="ziwei-adjective-stars mb-1">
          {renderStars(palace.adjectiveStars, "ziwei-adjective-stars")}
        </div>

        {/* 流年星曜 - 如流昌等 */}
        {palace.yearlyStars && palace.yearlyStars.length > 0 && (
          <div className="text-xs text-blue-600 font-medium mb-1">
            {palace.yearlyStars.includes("流昌") ? "流昌" : ""}
          </div>
        )}

        {/* 童限信息 */}
        {palace.decadalName && palace.decadalStem && (
          <div className="text-xs text-indigo-600 font-medium mb-1">
            {palace.decadalName}·{palace.decadalStem}
          </div>
        )}

        {/* 博士十二神 */}
        {palace.boshi12 && (
          <div className="text-xs text-orange-600 font-medium mb-1">
            {palace.boshi12}
          </div>
        )}

        {/* 流年将前诸星 */}
        {palace.jiangqian12 && (
          <div className="text-xs text-red-500 mb-1">{palace.jiangqian12}</div>
        )}

        {/* 流年岁前诸星 */}
        {palace.suiqian12 && (
          <div className="text-xs text-gray-500 mb-1">{palace.suiqian12}</div>
        )}
      </div>

      {/* 下半部：其他信息 */}
      <div className="ziwei-palace-lower">
        {/* 宫位名称 */}
        <div className="text-center text-sm font-bold text-gray-800 mb-1">
          {palace.name}
          {isSoulPalace && <span className="text-blue-500 ml-1">(命)</span>}
          {isBodyPalace && <span className="text-red-500 ml-1">(身)</span>}
        </div>

        {/* 年限显示 */}
        <div className="text-center text-xs text-gray-600 mb-1">
          {palace.ages ? palace.ages.join(" ") : ""}
        </div>

        {/* 大限年龄 */}
        <div className="text-center text-xs text-gray-500 mb-1">
          {palace.decadal.range.join(" - ")}
        </div>

        {/* 底部：长生十二神和天干地支在同一行 */}
        <div className="ziwei-palace-footer flex justify-between items-center">
          {/* 长生十二神 */}
          <span className="text-xs text-purple-600 font-medium">
            {palace.changsheng12 || ""}
          </span>

          {/* 天干地支 */}
          <span className="text-sm font-bold">
            <span className="text-gray-600">{palace.heavenlyStem}</span>
            <span className="text-gray-800">{palace.earthlyBranch}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// 辅助函数：根据排盘类型返回特殊高亮样式
function getChartTypeHighlight(
  chartType: ChartType,
  palaceIndex: number,
  extendedData?: ExtendedIztroChart
): string {
  if (!extendedData) return "";

  switch (chartType) {
    case "flying":
      // 飞星盘：高亮有四化星飞入/飞出的宫位
      if (
        extendedData.flyingStars?.some(
          (fs) => fs.fromPalace === palaceIndex || fs.toPalace === palaceIndex
        )
      ) {
        return "ziwei-flying-highlight";
      }
      break;
    case "sanhe":
      // 三合盘：高亮三方四正宫位
      if (
        extendedData.sanheGroups?.some((group) =>
          group.relatedPalaces.includes(palaceIndex)
        )
      ) {
        return "ziwei-sanhe-highlight";
      }
      break;
    case "sihua":
      // 四化盘：高亮有四化星的宫位
      const palace = extendedData.palaces[palaceIndex];
      if (palace && hasAnyMutagenStar(palace)) {
        return "ziwei-sihua-highlight";
      }
      break;
    default:
      return "";
  }
  return "";
}

// 辅助函数：检查宫位是否有四化星
function hasAnyMutagenStar(palace: Palace): boolean {
  const allStars = [
    ...palace.majorStars,
    ...palace.minorStars,
    ...palace.adjectiveStars,
  ];
  return allStars.some((star) => star.mutagen);
}
