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
  chartType = "sanhe",
  extendedData,
}) => {
  // 判断当前宫位是否为命宫
  const isSoulPalace = palace.earthlyBranch === soulPalaceBranch;
  // 判断当前宫位是否为身宫
  const isBodyPalace = palace.earthlyBranch === bodyPalaceBranch;
  // 判断当前宫位是否为来因宫
  const isOriginalPalace = palace.isOriginalPalace;

  // 获取四化样式类名的辅助函数
  const getMutagenClass = (mutagen: string): string => {
    switch (mutagen) {
      case "禄":
        return "bg-yellow-500 text-white text-xs px-1 py-0.5 rounded font-bold";
      case "权":
        return "bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold";
      case "科":
        return "bg-green-500 text-white text-xs px-1 py-0.5 rounded font-bold";
      case "忌":
        return "bg-gray-600 text-white text-xs px-1 py-0.5 rounded font-bold";
      default:
        return "";
    }
  };

  // 根据权威亮度对照表推算星曜亮度
  const inferStarBrightness = (
    starName: string,
    earthlyBranch: string
  ): string => {
    // 地支索引映射：子丑寅卯辰巳午未申酉戌亥
    const branchIndex: { [key: string]: number } = {
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

    const idx = branchIndex[earthlyBranch];
    if (idx === undefined) return "";

    // 根据权威亮度对照表进行精确匹配
    const brightnessTable: { [key: string]: string[] } = {
      // 十四主星
      紫微: [
        "平",
        "庙",
        "得",
        "利",
        "旺",
        "庙",
        "旺",
        "庙",
        "得",
        "利",
        "旺",
        "平",
      ],
      天机: [
        "庙",
        "陷",
        "旺",
        "庙",
        "陷",
        "旺",
        "庙",
        "陷",
        "旺",
        "庙",
        "陷",
        "旺",
      ],
      太阳: [
        "陷",
        "陷",
        "庙",
        "庙",
        "旺",
        "旺",
        "庙",
        "得",
        "得",
        "平",
        "戌",
        "陷",
      ],
      武曲: [
        "庙",
        "庙",
        "得",
        "利",
        "庙",
        "得",
        "庙",
        "庙",
        "得",
        "利",
        "庙",
        "得",
      ],
      天同: [
        "旺",
        "陷",
        "平",
        "旺",
        "陷",
        "庙",
        "陷",
        "陷",
        "得",
        "旺",
        "陷",
        "庙",
      ],
      廉贞: [
        "平",
        "利",
        "庙",
        "陷",
        "利",
        "平",
        "旺",
        "利",
        "庙",
        "陷",
        "利",
        "平",
      ],
      天府: [
        "庙",
        "庙",
        "庙",
        "得",
        "庙",
        "得",
        "庙",
        "庙",
        "庙",
        "得",
        "庙",
        "得",
      ],
      太阴: [
        "庙",
        "旺",
        "陷",
        "陷",
        "陷",
        "陷",
        "陷",
        "陷",
        "得",
        "旺",
        "庙",
        "庙",
      ],
      贪狼: [
        "旺",
        "庙",
        "平",
        "陷",
        "庙",
        "陷",
        "旺",
        "庙",
        "平",
        "陷",
        "庙",
        "陷",
      ],
      巨门: [
        "旺",
        "陷",
        "庙",
        "庙",
        "陷",
        "旺",
        "旺",
        "陷",
        "庙",
        "庙",
        "陷",
        "旺",
      ],
      天相: [
        "庙",
        "庙",
        "陷",
        "庙",
        "得",
        "庙",
        "庙",
        "庙",
        "陷",
        "庙",
        "得",
        "亥",
      ],
      天梁: [
        "庙",
        "庙",
        "陷",
        "陷",
        "庙",
        "陷",
        "旺",
        "庙",
        "陷",
        "陷",
        "庙",
        "庙",
      ],
      七杀: [
        "庙",
        "旺",
        "庙",
        "旺",
        "庙",
        "平",
        "旺",
        "旺",
        "庙",
        "旺",
        "庙",
        "平",
      ],
      破军: [
        "庙",
        "旺",
        "得",
        "陷",
        "庙",
        "旺",
        "旺",
        "旺",
        "得",
        "陷",
        "庙",
        "旺",
      ],

      // 六吉星
      文昌: [
        "平",
        "庙",
        "陷",
        "得",
        "利",
        "庙",
        "陷",
        "得",
        "利",
        "庙",
        "陷",
        "旺",
      ],
      文曲: [
        "旺",
        "庙",
        "陷",
        "利",
        "得",
        "庙",
        "陷",
        "得",
        "旺",
        "庙",
        "陷",
        "旺",
      ],
      左辅: [
        "得",
        "庙",
        "得",
        "得",
        "庙",
        "平",
        "旺",
        "庙",
        "得",
        "得",
        "庙",
        "平",
      ],
      右弼: [
        "得",
        "庙",
        "得",
        "得",
        "庙",
        "平",
        "旺",
        "庙",
        "得",
        "得",
        "庙",
        "平",
      ],
      天魁: [
        "旺",
        "庙",
        "旺",
        "庙",
        "庙",
        "旺",
        "庙",
        "庙",
        "旺",
        "庙",
        "庙",
        "旺",
      ],
      天钺: [
        "旺",
        "庙",
        "旺",
        "庙",
        "庙",
        "旺",
        "庙",
        "庙",
        "旺",
        "庙",
        "庙",
        "旺",
      ],

      // 禄马
      禄存: [
        "旺",
        "得",
        "庙",
        "庙",
        "得",
        "旺",
        "旺",
        "得",
        "庙",
        "庙",
        "得",
        "旺",
      ],
      天马: [
        "陷",
        "陷",
        "旺",
        "陷",
        "陷",
        "庙",
        "陷",
        "陷",
        "旺",
        "陷",
        "陷",
        "庙",
      ],

      // 六煞星
      擎羊: [
        "陷",
        "庙",
        "平",
        "陷",
        "庙",
        "平",
        "陷",
        "庙",
        "平",
        "陷",
        "庙",
        "平",
      ],
      陀罗: [
        "陷",
        "庙",
        "平",
        "陷",
        "庙",
        "平",
        "陷",
        "庙",
        "平",
        "陷",
        "庙",
        "平",
      ],
      火星: [
        "得",
        "陷",
        "庙",
        "旺",
        "得",
        "利",
        "庙",
        "陷",
        "旺",
        "陷",
        "庙",
        "陷",
      ],
      铃星: [
        "得",
        "陷",
        "庙",
        "旺",
        "得",
        "利",
        "庙",
        "陷",
        "旺",
        "陷",
        "庙",
        "陷",
      ],
      地空: [
        "陷",
        "陷",
        "得",
        "陷",
        "陷",
        "旺",
        "陷",
        "陷",
        "得",
        "陷",
        "陷",
        "旺",
      ],
      地劫: [
        "陷",
        "陷",
        "得",
        "陷",
        "陷",
        "旺",
        "陷",
        "陷",
        "得",
        "陷",
        "陷",
        "旺",
      ],

      // 桃花星
      天姚: [
        "旺",
        "庙",
        "陷",
        "庙",
        "旺",
        "陷",
        "平",
        "庙",
        "陷",
        "庙",
        "旺",
        "庙",
      ],
      天刑: [
        "平",
        "平",
        "庙",
        "庙",
        "平",
        "平",
        "平",
        "平",
        "庙",
        "庙",
        "平",
        "平",
      ],
      红鸾: [
        "陷",
        "平",
        "庙",
        "旺",
        "平",
        "平",
        "陷",
        "平",
        "庙",
        "旺",
        "平",
        "平",
      ],
      天喜: [
        "旺",
        "平",
        "平",
        "陷",
        "平",
        "平",
        "旺",
        "平",
        "陷",
        "陷",
        "平",
        "平",
      ],
      华盖: [
        "平",
        "旺",
        "平",
        "平",
        "旺",
        "平",
        "平",
        "旺",
        "平",
        "平",
        "旺",
        "平",
      ],
    };

    // 查找星曜亮度
    if (brightnessTable[starName]) {
      return brightnessTable[starName][idx] || "";
    }

    // 无亮度评级的星曜返回空字符串
    // 根据对照表，以下星曜无亮度评级：
    const noRatingStars = [
      "天伤",
      "天使",
      "天德",
      "月德",
      "龙德",
      "天官",
      "天福",
      "天厨",
      "天巫",
      "天月",
      "台辅",
      "封诰",
      "三台",
      "八座",
      "恩光",
      "天贵",
      "龙池",
      "凤阁",
      "解神",
      "阴煞",
      "孤辰",
      "寡宿",
      "蜚廉",
      "破碎",
      "咸池",
      "天空",
      "天才",
      "天寿",
      "截空",
      "旬空",
      "博士",
      "力士",
      "青龙",
      "小耗",
      "将军",
      "奏书",
      "飞廉",
      "喜神",
      "病符",
      "大耗",
      "伏兵",
      "官府",
      "长生",
      "沐浴",
      "冠带",
      "临官",
      "帝旺",
      "衰",
      "病",
      "死",
      "墓",
      "绝",
      "胎",
      "养",
      "年解",
      "月解",
    ];

    if (noRatingStars.includes(starName)) {
      return "";
    }

    return ""; // 其他未知星曜
  };

  // 根据星曜类型渲染不同样式的星曜
  const renderStarsByType = (stars: Palace["majorStars"], starType: string) => {
    if (!stars || stars.length === 0) {
      return null;
    }

    // 根据星曜类型过滤
    const filteredStars = stars.filter((star) => {
      switch (starType) {
        case "major":
          return star.type === "major";
        case "soft":
          return star.type === "soft";
        case "tough":
          return star.type === "tough";
        case "adjective":
          return star.type === "adjective";
        case "flower":
          return star.type === "flower";
        case "helper":
          return star.type === "helper";
        case "lucun":
          return star.type === "lucun";
        case "tianma":
          return star.type === "tianma";
        default:
          return false;
      }
    });

    if (filteredStars.length === 0) {
      return null;
    }

    const getTypeStyles = (type: string) => {
      switch (type) {
        case "major":
          return "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm px-2 py-1 rounded shadow-md";
        case "soft":
          return "bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-xs px-1.5 py-0.5 rounded";
        case "tough":
          return "bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium text-xs px-1.5 py-0.5 rounded";
        case "adjective":
          return "bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs px-1 py-0.5 rounded";
        case "flower":
          return "bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs px-1 py-0.5 rounded";
        case "helper":
          return "bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs px-1 py-0.5 rounded";
        case "lucun":
          return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium text-xs px-1.5 py-0.5 rounded";
        case "tianma":
          return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-xs px-1.5 py-0.5 rounded";
        default:
          return "bg-gray-300 text-gray-700 text-xs px-1 py-0.5 rounded";
      }
    };

    return (
      <div className="flex flex-wrap gap-1 mb-1">
        {filteredStars.map((star, idx) => {
          // 获取星曜亮度，如果没有则推算
          const brightness =
            star.brightness ||
            inferStarBrightness(star.name, palace.earthlyBranch);

          return (
            <span
              key={`${star.name}-${idx}`}
              className="inline-flex items-center"
            >
              <span className={getTypeStyles(starType)}>
                {star.name}
                {brightness && (
                  <span className="text-xs ml-1 opacity-90">{brightness}</span>
                )}
              </span>
              {star.mutagen && (
                <span
                  className={`ziwei-star-mutagen ${getMutagenClass(
                    star.mutagen
                  )} ml-1`}
                >
                  {star.mutagen}
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // 根据排盘类型获取高亮样式
  const getChartTypeHighlight = (
    chartType: ChartType,
    palaceIndex: number,
    extendedData?: ExtendedIztroChart
  ): string => {
    // 这里可以根据不同的排盘类型添加特殊的高亮逻辑
    // 目前返回空字符串，后续可以扩展
    return "";
  };

  return (
    <div
      className={`ziwei-palace-card ${
        isBodyPalace ? "ziwei-body-palace" : ""
      } ${isSoulPalace ? "ziwei-soul-palace" : ""} ${
        isOriginalPalace ? "ziwei-original-palace" : ""
      } ${getChartTypeHighlight(chartType, index, extendedData)}`}
      data-palace={index}
    >
      {/* 上半部：星曜显示区域 - 按照紫微斗数知识库分类体系 */}
      <div className="ziwei-palace-stars-upper flex-1">
        {/* 主星区域 (major) - 十四主星 */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "major"
        )}

        {/* 六吉星区域 (soft) - 文昌文曲左辅右弼天魁天钺 */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "soft"
        )}

        {/* 六煞星区域 (tough) - 擎羊陀罗火星铃星地空地劫 */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "tough"
        )}

        {/* 禄存区域 (lucun) */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "lucun"
        )}

        {/* 天马区域 (tianma) */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "tianma"
        )}

        {/* 桃花星区域 (flower) - 红鸾天喜天姚咸池 */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "flower"
        )}

        {/* 解神区域 (helper) */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "helper"
        )}

        {/* 杂曜区域 (adjective) - 其他杂曜 */}
        {renderStarsByType(
          [
            ...palace.majorStars,
            ...palace.minorStars,
            ...palace.adjectiveStars,
          ],
          "adjective"
        )}

        {/* 运限星曜分类显示 */}
        {palace.horoscopeStarCategories && (
          <div className="mb-1">
            {/* 岁建十二神：流羊、流陀、流魁、流钺、年解 */}
            {palace.horoscopeStarCategories.suijian12.length > 0 && (
              <div className="text-xs text-red-600 font-medium mb-0.5">
                {palace.horoscopeStarCategories.suijian12.join(" ")}
              </div>
            )}

            {/* 鸾喜马曲昌曲类：流喜、运鸾、流马、运曲、运昌 */}
            {palace.horoscopeStarCategories.luanxi.length > 0 && (
              <div className="text-xs text-pink-600 font-medium mb-0.5">
                {palace.horoscopeStarCategories.luanxi.join(" ")}
              </div>
            )}

            {/* 其他运限星曜 */}
            {palace.horoscopeStarCategories.other.length > 0 && (
              <div className="text-xs text-purple-600 font-medium mb-0.5">
                {palace.horoscopeStarCategories.other.join(" ")}
              </div>
            )}
          </div>
        )}

        {/* 神煞系统区域 - 固定位置显示 */}
        <div className="ziwei-shensha-area border-t border-gray-200 pt-1 mt-1">
          {/* 长生十二神 */}
          {palace.changsheng12 && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded mb-1 inline-block">
              <span className="font-medium">长生:</span> {palace.changsheng12}
            </div>
          )}

          {/* 博士十二神 */}
          {palace.boshi12 && (
            <div className="text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded mb-1 inline-block ml-1">
              <span className="font-medium">博士:</span> {palace.boshi12}
            </div>
          )}

          {/* 将前十二神 */}
          {palace.jiangqian12 && (
            <div className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded mb-1 inline-block ml-1">
              <span className="font-medium">将前:</span> {palace.jiangqian12}
            </div>
          )}

          {/* 岁前十二神 */}
          {palace.suiqian12 && (
            <div className="text-xs bg-gray-100 text-gray-800 px-1 py-0.5 rounded mb-1 inline-block ml-1">
              <span className="font-medium">岁前:</span> {palace.suiqian12}
            </div>
          )}
        </div>
      </div>

      {/* 下半部：宫位信息 */}
      <div className="ziwei-palace-lower">
        {/* 宫位名称 */}
        <div className="text-center text-sm font-bold text-gray-800 mb-1">
          {palace.name}
          {isSoulPalace && <span className="text-blue-500 ml-1">(命)</span>}
          {isBodyPalace && <span className="text-red-500 ml-1">(身)</span>}
          {isOriginalPalace && (
            <span className="text-purple-500 ml-1">(来因)</span>
          )}
        </div>

        {/* 年限显示 */}
        <div className="text-center text-xs text-gray-600 mb-1">
          {palace.ages ? palace.ages.join(" ") : ""}
        </div>

        {/* 大限年龄 */}
        <div className="text-center text-xs text-gray-500 mb-1">
          {palace.decadal.range[0]} - {Math.min(palace.decadal.range[1], 90)}
        </div>

        {/* 底部：天干地支 */}
        <div className="text-center">
          <span className="text-sm font-bold">
            <span className="text-gray-600">{palace.heavenlyStem}</span>
            <span className="text-gray-800">{palace.earthlyBranch}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
