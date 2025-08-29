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
 * 生成AI分析用的完整描述文本
 * @param {IztroChart | ExtendedIztroChart} chartData - 排盘数据
 * @returns {string} - 格式化的描述文本
 */
function generateAIDescription(
  chartData: IztroChart | ExtendedIztroChart
): string {
  const isExtended = "chartType" in chartData;

  // 基本信息
  const basicInfo = `
【个人信息】
性别：${chartData.gender}
阳历：${chartData.solarDate}
农历：${chartData.lunarDate}
八字：${chartData.chineseDate}
时辰：${chartData.time}(${chartData.timeRange})
星座：${chartData.sign}
生肖：${chartData.zodiac}
五行局：${chartData.fiveElementsClass}
命主：${chartData.soul}
身主：${chartData.body}
命宫：${chartData.earthlyBranchOfSoulPalace}
身宫：${chartData.earthlyBranchOfBodyPalace}
`;

  // 三合盘详细描述
  let sanheDescription = `
【三合盘详细分析】
三合盘显示完整的星曜分布和宫位关系：

命宫三方四正格局：
`;

  // 找到命宫
  const soulPalace = chartData.palaces.find(
    (p) => p.earthlyBranch === chartData.earthlyBranchOfSoulPalace
  );
  if (soulPalace) {
    const soulIndex = soulPalace.index;
    const wealthIndex = (soulIndex + 4) % 12; // 财帛宫
    const careerIndex = (soulIndex + 8) % 12; // 官禄宫
    const travelIndex = (soulIndex + 6) % 12; // 迁移宫

    const wealthPalace = chartData.palaces[wealthIndex];
    const careerPalace = chartData.palaces[careerIndex];
    const travelPalace = chartData.palaces[travelIndex];

    if (wealthPalace && careerPalace && travelPalace) {
      sanheDescription += `- 命宫(${soulPalace.name}): ${
        soulPalace.majorStars.map((s) => s.name).join("、") || "无主星"
      }
- 财帛宫(${wealthPalace.name}): ${
        wealthPalace.majorStars.map((s) => s.name).join("、") || "无主星"
      }
- 官禄宫(${careerPalace.name}): ${
        careerPalace.majorStars.map((s) => s.name).join("、") || "无主星"
      }
- 迁移宫(${travelPalace.name}): ${
        travelPalace.majorStars.map((s) => s.name).join("、") || "无主星"
      }

三方四正分析要点：
- 命宫主个性、才华、先天格局
- 财帛宫主财运、理财能力、赚钱方式
- 官禄宫主事业、工作、社会地位
- 迁移宫主人际、外出、变动机会
`;
    }
  }

  sanheDescription += `
十四主星分布概况：
`;

  // 统计主星分布
  const majorStarMap: { [key: string]: string } = {};
  chartData.palaces.forEach((palace) => {
    palace.majorStars.forEach((star) => {
      if (
        [
          "紫微",
          "天机",
          "太阳",
          "武曲",
          "天同",
          "廉贞",
          "天府",
          "太阴",
          "贪狼",
          "巨门",
          "天相",
          "天梁",
          "七杀",
          "破军",
        ].includes(star.name)
      ) {
        majorStarMap[star.name] = palace.name;
      }
    });
  });

  Object.entries(majorStarMap).forEach(([star, palace]) => {
    sanheDescription += `- ${star}星在${palace}\n`;
  });

  // 飞星盘详细描述
  let flyingDescription = `
【飞星盘详细分析】
飞星盘显示四化星的具体飞化路径和影响关系：
`;

  // 生成飞星详细信息
  chartData.palaces.forEach((palace: Palace, palaceIndex: number) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    const sihuaStars = allStars.filter((star) => star.mutagen);

    if (sihuaStars.length > 0) {
      sihuaStars.forEach((star) => {
        const fromPalace = palace.name;
        const symbol =
          star.mutagen === "禄"
            ? "→禄"
            : star.mutagen === "权"
            ? "→权"
            : star.mutagen === "科"
            ? "→科"
            : "→忌";
        flyingDescription += `- ${star.name}${symbol} 从${fromPalace}飞出，影响对宫及三方四正\n`;
      });
    }
  });

  flyingDescription += `
飞星符号说明：
→禄：化禄星飞入，主财运、贵人、顺遂
→权：化权星飞入，主权力、主导、积极
→科：化科星飞入，主名声、考试、文书
→忌：化忌星飞入，主阻碍、纠纷、不顺
`;

  // 四化盘详细描述
  let sihuaDescription = `
【四化盘详细分析】
四化盘专门显示四化星曜的分布和作用：
`;

  // 统计四化星分布
  const luStars: string[] = [];
  const quanStars: string[] = [];
  const keStars: string[] = [];
  const jiStars: string[] = [];

  chartData.palaces.forEach((palace: Palace) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    allStars.forEach((star) => {
      if (star.mutagen === "禄") luStars.push(`${star.name}(${palace.name})`);
      if (star.mutagen === "权") quanStars.push(`${star.name}(${palace.name})`);
      if (star.mutagen === "科") keStars.push(`${star.name}(${palace.name})`);
      if (star.mutagen === "忌") jiStars.push(`${star.name}(${palace.name})`);
    });
  });

  sihuaDescription += `
化禄星分布：${luStars.join("、") || "无"}
化权星分布：${quanStars.join("、") || "无"}
化科星分布：${keStars.join("、") || "无"}
化忌星分布：${jiStars.join("、") || "无"}

四化星作用说明：
化禄：主财运亨通、贵人相助、事业顺利
化权：主权力地位、领导能力、积极进取
化科：主名声地位、考试顺利、文书吉利
化忌：主阻碍困难、人际纠纷、事业不顺
`;

  // 宫位详情
  let palaceDetails = "\n【十二宫位详情】\n";

  chartData.palaces.forEach((palace: Palace, index: number) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    const majorStars = allStars.filter((star) =>
      [
        "紫微",
        "天机",
        "太阳",
        "武曲",
        "天同",
        "廉贞",
        "天府",
        "太阴",
        "贪狼",
        "巨门",
        "天相",
        "天梁",
        "七杀",
        "破军",
      ].includes(star.name)
    );
    const luckyStars = allStars.filter((star) =>
      ["文昌", "文曲", "左辅", "右弼", "天魁", "天钺"].includes(star.name)
    );
    const unluckyStars = allStars.filter((star) =>
      ["擎羊", "陀罗", "火星", "铃星", "地空", "地劫"].includes(star.name)
    );
    const sihuaStars = allStars.filter((star) => star.mutagen);

    palaceDetails += `
${palace.name}宫（${palace.heavenlyStem}${palace.earthlyBranch}）${
      palace.isBodyPalace ? "[身宫]" : ""
    }${palace.isOriginalPalace ? "[来因宫]" : ""}
- 主星：${
      majorStars
        .map((s) => `${s.name}${s.brightness ? `(${s.brightness})` : ""}`)
        .join("、") || "无"
    }
- 吉星：${
      luckyStars
        .map((s) => `${s.name}${s.brightness ? `(${s.brightness})` : ""}`)
        .join("、") || "无"
    }
- 煞星：${
      unluckyStars
        .map((s) => `${s.name}${s.brightness ? `(${s.brightness})` : ""}`)
        .join("、") || "无"
    }
- 四化：${sihuaStars.map((s) => `${s.name}${s.mutagen}`).join("、") || "无"}
- 大限：${palace.decadal.range.join("-")}岁
- 神煞：长生(${palace.changsheng12}) 博士(${palace.boshi12}) 将前(${
      palace.jiangqian12
    })
`;
  });

  // 四化统计
  let sihuaSummary = "";
  if (isExtended && chartData.sihuaDisplay) {
    sihuaSummary = `
【四化星统计】
化禄星：${chartData.sihuaDisplay.lu.map((s) => s.name).join("、") || "无"}
化权星：${chartData.sihuaDisplay.quan.map((s) => s.name).join("、") || "无"}
化科星：${chartData.sihuaDisplay.ke.map((s) => s.name).join("、") || "无"}
化忌星：${chartData.sihuaDisplay.ji.map((s) => s.name).join("、") || "无"}
`;
  }

  return `${basicInfo}${sanheDescription}${flyingDescription}${sihuaDescription}${palaceDetails}${sihuaSummary}

【分析要求】
请基于以上排盘信息进行紫微斗数分析，重点关注：
1. 命格特质和性格分析
2. 事业财运发展趋势
3. 感情婚姻状况
4. 健康注意事项
5. 人生重要转折点和大运分析`;
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
  const [chartType, setChartType] = useState<ChartType>("sanhe");

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
      case "sihua":
        return renderSihuaPalaceContent(palace, index);
      case "sanhe":
      default:
        return renderSanhePalaceContent(palace, index);
    }
  };

  // 飞星盘宫位内容
  const renderFlyingPalaceContent = (palace: Palace, index: number) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    const sihuaStars = allStars.filter((star) => star.mutagen);
    const normalStars = allStars.filter((star) => !star.mutagen);

    // 获取宫位名称
    const palaceNames = [
      "命宫",
      "兄弟宫",
      "夫妻宫",
      "子女宫",
      "财帛宫",
      "疾厄宫",
      "迁移宫",
      "交友宫",
      "事业宫",
      "田宅宫",
      "福德宫",
      "父母宫",
    ];

    return (
      <div className="grid grid-cols-1 gap-y-2 text-sm">
        {sihuaStars.length > 0 ? (
          <>
            {sihuaStars.map((star, starIndex) => (
              <p
                key={starIndex}
                className="bg-amber-50 p-2 rounded border-l-4 border-amber-400"
              >
                <span
                  className={`font-semibold inline-block w-8 text-center rounded text-white text-xs mr-2 ${
                    star.mutagen === "禄"
                      ? "bg-red-500"
                      : star.mutagen === "权"
                      ? "bg-blue-500"
                      : star.mutagen === "科"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  {star.mutagen}
                </span>
                <span className="font-semibold text-amber-800">
                  {star.name}
                </span>
                <span className="text-amber-600 ml-2">
                  → 飞入{palaceNames[index]}
                </span>
                {star.brightness && (
                  <span className="text-xs text-gray-600 ml-2">
                    ({star.brightness})
                  </span>
                )}
              </p>
            ))}
            {normalStars.length > 0 && (
              <p className="text-gray-600 text-xs">
                <span className="font-semibold">其他星:</span>{" "}
                {formatStars(normalStars.slice(0, 2))}
                {normalStars.length > 2 && <span>...</span>}
              </p>
            )}
          </>
        ) : (
          <div className="text-gray-500 italic text-xs">
            本宫无四化星曜
            {normalStars.length > 0 && (
              <p className="mt-1">
                <span className="font-semibold">主要星曜:</span>{" "}
                {formatStars(normalStars.slice(0, 3))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // 三合盘宫位内容（作为标准显示）
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm">
        {isMainTriad && (
          <p className="text-purple-600 font-medium mb-1 col-span-full">
            ★ 命宫三方四正
          </p>
        )}
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
              专门显示四化星曜的飞化关系。四化星会以特殊颜色标注，并显示"飞入"的宫位信息。
              化禄(红)、化权(蓝)、化科(绿)、化忌(灰)分别代表不同的能量转化。
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
      case "sanhe":
      default:
        return (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
            <span className="font-semibold text-purple-800">
              🔮 三合盘说明：
            </span>
            <span className="text-purple-700">
              突出显示命宫三方四正的宫位组合和呼应关系，完整显示所有星曜信息
            </span>
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
                  {palace.isOriginalPalace && (
                    <span className="text-purple-600 ml-2 font-normal text-sm badge badge-secondary">
                      来因宫
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
