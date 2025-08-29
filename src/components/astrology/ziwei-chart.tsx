"use client";

import { useState } from "react";
import type { ChartType, ExtendedIztroChart } from "./ziwei-types";
import { ZiweiPalace } from "./ziwei-palace";
import { ZiweiTextChart } from "./ziwei-text-chart";

import { ZiweiSanheLines } from "./ziwei-sanhe-lines";
import "./ziwei-chart.css";

/**
 * 生成AI分析用的完整描述文本
 * @param {ExtendedIztroChart} chartData - 排盘数据
 * @returns {string} - 格式化的描述文本
 */
function generateAIDescription(chartData: ExtendedIztroChart): string {
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
    const careerIndex = (soulIndex + 8) % 12; // 事业宫
    const travelIndex = (soulIndex + 6) % 12; // 迁移宫

    const wealthPalace = chartData.palaces[wealthIndex];
    const careerPalace = chartData.palaces[careerIndex];
    const travelPalace = chartData.palaces[travelIndex];

    sanheDescription += `- 命宫(${soulPalace.name}): ${
      soulPalace.majorStars.map((s) => s.name).join("、") || "无主星"
    }
- 财帛宫(${wealthPalace.name}): ${
      wealthPalace.majorStars.map((s) => s.name).join("、") || "无主星"
    }
- 事业宫(${careerPalace.name}): ${
      careerPalace.majorStars.map((s) => s.name).join("、") || "无主星"
    }
- 迁移宫(${travelPalace.name}): ${
      travelPalace.majorStars.map((s) => s.name).join("、") || "无主星"
    }

三方四正分析要点：
- 命宫主个性、才华、先天格局
- 财帛宫主财运、理财能力、赚钱方式
- 事业宫主事业、工作、社会地位
- 迁移宫主人际、外出、变动机会
`;
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
  chartData.palaces.forEach((palace, palaceIndex: number) => {
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

  chartData.palaces.forEach((palace) => {
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

  chartData.palaces.forEach((palace, index: number) => {
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
  if (chartData.sihuaDisplay) {
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

export function ZiweiChart() {
  const [birthDate, setBirthDate] = useState<string>("2025-01-29");
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [gender, setGender] = useState<string>("male");
  const [lunar, setLunar] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ExtendedIztroChart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "text">("grid");
  const [chartType, setChartType] = useState<ChartType>("sanhe");
  const [showSanheLines, setShowSanheLines] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "success" | "error"
  >("idle");

  // 复制功能
  const handleCopyToClipboard = async () => {
    if (!chartData) return;

    setCopyStatus("copying");
    try {
      const aiDescription = generateAIDescription(chartData);
      await navigator.clipboard.writeText(aiDescription);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      console.error("复制失败:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleSubmit = async () => {
    if (!birthDate || !birthTime) {
      setError("请填写完整的出生日期和时间");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        birth_date: birthDate,
        birth_time: birthTime,
        gender: gender,
        lunar: lunar.toString(),
      });

      const response = await fetch(`/api/astrology/ziwei?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "排盘失败");
      }

      const data = await response.json();

      // 转换API响应数据为前端需要的格式
      const transformedData: ExtendedIztroChart = {
        gender: data.gender,
        solarDate: data.solarDate,
        lunarDate: data.lunarDate,
        chineseDate: data.chineseDate,
        time: data.time,
        timeRange: data.timeRange,
        sign: data.sign,
        zodiac: data.zodiac,
        earthlyBranchOfBodyPalace: data.earthlyBranchOfBodyPalace,
        earthlyBranchOfSoulPalace: data.earthlyBranchOfSoulPalace,
        soul: data.soul,
        body: data.body,
        fiveElementsClass: data.fiveElementsClass,
        palaces: data.palaces,
        chartType: "sanhe", // 默认为三合盘
        // 生成飞星盘、三合盘、四化盘数据
        flyingStars: generateFlyingStarData(data.palaces),
        sanheGroups: generateSanheGroups(),
        sihuaDisplay: generateSihuaDisplay(data.palaces),
      };

      setChartData(transformedData);

      console.log("排盘成功:", {
        输入类型: lunar ? "农历" : "公历",
        输入日期: birthDate,
        对应公历: data.solarDate,
        对应农历: data.lunarDate,
        八字: data.chineseDate,
        命宫: data.earthlyBranchOfSoulPalace,
        身宫: data.earthlyBranchOfBodyPalace,
        五行局: data.fiveElementsClass,
      });
    } catch (err) {
      console.error("排盘失败:", err);
      setError(err instanceof Error ? err.message : "排盘失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChartData(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生日期
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生时间
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性别
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期类型
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!lunar}
                  onChange={() => setLunar(false)}
                  className="mr-2"
                />
                公历
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={lunar}
                  onChange={() => setLunar(true)}
                  className="mr-2"
                />
                农历
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "排盘中..." : "开始排盘"}
          </button>

          {chartData && (
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              重新排盘
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {chartData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">排盘结果</h3>
              <div className="flex items-center space-x-3">
                {/* 复制AI描述按钮 */}
                <button
                  onClick={handleCopyToClipboard}
                  disabled={copyStatus === "copying"}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copyStatus === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : copyStatus === "error"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : copyStatus === "copying"
                      ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
                  }`}
                >
                  {copyStatus === "copying" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>复制中...</span>
                    </>
                  ) : copyStatus === "success" ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>已复制</span>
                    </>
                  ) : copyStatus === "error" ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>复制失败</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      <span>复制AI描述</span>
                    </>
                  )}
                </button>

                {/* 视图模式切换按钮 */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    图形排盘
                  </button>
                  <button
                    onClick={() => setViewMode("text")}
                    className={`px-4 py-2 rounded-md ${
                      viewMode === "text"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    文字排盘
                  </button>
                </div>
              </div>
            </div>

            {/* 排盘类型选项卡 - 只在图形排盘模式下显示 */}
            {viewMode === "grid" && (
              <div className="flex justify-between items-center border-b border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setChartType("sanhe")}
                    className={`px-4 py-2 font-medium ${
                      chartType === "sanhe"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    三合盘
                  </button>
                  <button
                    onClick={() => setChartType("flying")}
                    className={`px-4 py-2 font-medium ${
                      chartType === "flying"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    飞星盘
                  </button>
                  <button
                    onClick={() => setChartType("sihua")}
                    className={`px-4 py-2 font-medium ${
                      chartType === "sihua"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    四化盘
                  </button>
                </div>

                {/* 三方四正连线切换按钮 - 只在三合盘模式下显示 */}
                {chartType === "sanhe" && (
                  <button
                    className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                      showSanheLines
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-purple-600 border-purple-600 hover:bg-purple-50"
                    }`}
                    onClick={() => setShowSanheLines(!showSanheLines)}
                    title="切换三方四正连线显示"
                  >
                    {showSanheLines ? "隐藏连线" : "显示连线"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 基本信息显示 */}

          {/* 根据选择的排盘类型和显示模式渲染内容 */}
          {viewMode === "grid" ? (
            <>
              {chartType === "sanhe" && (
                <div
                  className={`ziwei-astrolabe ${getChartTypeClass(chartType)} ${
                    showSanheLines ? "show-sanhe-lines" : ""
                  }`}
                >
                  {/* 生成12个宫位 */}
                  {Array.from({ length: 12 }, (_, palaceIndex) => {
                    const palace = chartData.palaces[palaceIndex];
                    if (!palace) return null;

                    return (
                      <ZiweiPalace
                        key={`palace-${palaceIndex}`}
                        palace={palace}
                        index={palaceIndex}
                        soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
                        bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
                        chartType={chartType}
                        extendedData={chartData}
                      />
                    );
                  })}

                  {/* 三方四正连线 */}
                  <ZiweiSanheLines
                    chartData={chartData}
                    showLines={showSanheLines}
                  />

                  {/* 中心区域显示基本信息 - 占据4个格子 */}
                  <div className="ziwei-center-area">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center rounded-lg border border-indigo-200 w-full h-full flex flex-col justify-center">
                      <div className="text-lg font-bold text-indigo-800 mb-4">
                        <span
                          className={`mr-2 ${
                            chartData.gender === "男"
                              ? "text-blue-600"
                              : "text-pink-600"
                          }`}
                        >
                          {chartData.gender === "男" ? "♂" : "♀"}
                        </span>
                        基本信息
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            五行局：
                          </span>
                          <span className="text-gray-700">
                            {chartData.fiveElementsClass}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            四柱：
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.chineseDate}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            阳历：
                          </span>
                          <span className="text-gray-700">
                            {chartData.solarDate}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            农历：
                          </span>
                          <span className="text-gray-700">
                            {chartData.lunarDate}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            时辰：
                          </span>
                          <span className="text-gray-700">
                            {chartData.time}({chartData.timeRange})
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            生肖：
                          </span>
                          <span className="text-gray-700">
                            {chartData.zodiac}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            星座：
                          </span>
                          <span className="text-gray-700">
                            {chartData.sign}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            命主：
                          </span>
                          <span className="text-gray-700">
                            {chartData.soul}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            身主：
                          </span>
                          <span className="text-gray-700">
                            {chartData.body}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            命宫：
                          </span>
                          <span className="text-gray-700">
                            {chartData.earthlyBranchOfSoulPalace}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-indigo-700 block">
                            身宫：
                          </span>
                          <span className="text-gray-700">
                            {chartData.earthlyBranchOfBodyPalace}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {chartType === "flying" && (
                <div
                  className={`ziwei-astrolabe ${getChartTypeClass(
                    chartType
                  )} flying-star-mode`}
                >
                  {/* 飞星盘：突出显示四化星和飞化关系 */}
                  {Array.from({ length: 12 }, (_, palaceIndex) => {
                    const palace = chartData.palaces[palaceIndex];
                    if (!palace) return null;

                    return (
                      <ZiweiPalace
                        key={`palace-${palaceIndex}`}
                        palace={palace}
                        index={palaceIndex}
                        soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
                        bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
                        chartType={chartType}
                        extendedData={chartData}
                      />
                    );
                  })}

                  {/* 飞星连线和箭头 */}
                  <div className="flying-star-connections">
                    {chartData.flyingStars?.map((flyingStar, index) => {
                      // 简单的飞星连线显示
                      return (
                        <div
                          key={`flying-${index}`}
                          className="flying-star-indicator"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                            pointerEvents: "none",
                          }}
                        >
                          <div
                            className={`flying-star-badge ${flyingStar.mutagen}`}
                          >
                            {flyingStar.starName}
                            {flyingStar.mutagen}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 中心区域显示四化信息 */}
                  <div className="ziwei-center-area">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center rounded-lg border border-amber-200 w-full h-full flex flex-col justify-center">
                      <div className="text-lg font-bold text-amber-800 mb-4">
                        四化飞星
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <div className="text-left">
                          <span className="font-semibold text-red-600 block">
                            化禄:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.lu
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-blue-600 block">
                            化权:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.quan
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-green-600 block">
                            化科:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.ke
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-gray-600 block">
                            化忌:
                          </span>
                          <span className="text-gray-700 text-xs">
                            {chartData.sihuaDisplay?.ji
                              .map((s) => s.name)
                              .join(", ") || "无"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-amber-700">
                        💫 四化星在各宫位中以特殊颜色标注
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {chartType === "sihua" && (
                <div
                  className={`ziwei-astrolabe ${getChartTypeClass(chartType)}`}
                >
                  {/* 四化盘：专门显示四化星的分布和影响 */}
                  {Array.from({ length: 12 }, (_, palaceIndex) => {
                    const palace = chartData.palaces[palaceIndex];
                    if (!palace) return null;

                    return (
                      <ZiweiPalace
                        key={`palace-${palaceIndex}`}
                        palace={palace}
                        index={palaceIndex}
                        soulPalaceBranch={chartData.earthlyBranchOfSoulPalace}
                        bodyPalaceBranch={chartData.earthlyBranchOfBodyPalace}
                        chartType={chartType}
                        extendedData={chartData}
                      />
                    );
                  })}

                  {/* 中心区域显示四化统计 */}
                  <div className="ziwei-center-area">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 text-center rounded-lg border border-purple-200 w-full h-full flex flex-col justify-center">
                      <div className="text-lg font-bold text-purple-800 mb-4">
                        四化统计
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold text-red-600">
                            化禄:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.lu.length || 0}颗
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-blue-600">
                            化权:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.quan.length || 0}颗
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-green-600">
                            化科:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.ke.length || 0}颗
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">
                            化忌:
                          </span>
                          <span className="text-gray-700">
                            {chartData.sihuaDisplay?.ji.length || 0}颗
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ZiweiTextChart chartData={chartData} />
          )}
        </div>
      )}
    </div>
  );
}

// 辅助函数：根据排盘类型返回CSS类名
function getChartTypeClass(chartType: ChartType): string {
  switch (chartType) {
    case "flying":
      return "ziwei-flying-chart";
    case "sihua":
      return "ziwei-sihua-chart";
    case "sanhe":
    default:
      return "ziwei-sanhe-chart";
  }
}

// 临时辅助函数：生成飞星盘数据（后续完善）
function generateFlyingStarData(palaces: any[]): any[] {
  // 简化实现，寻找带四化的星曜
  const flyingStars: any[] = [];
  palaces.forEach((palace, palaceIndex) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    allStars.forEach((star) => {
      if (star.mutagen) {
        flyingStars.push({
          fromPalace: palaceIndex,
          toPalace: palaceIndex, // 暂时设为同宫位，后续优化
          starName: star.name,
          mutagen: star.mutagen,
          level: "life",
        });
      }
    });
  });
  return flyingStars;
}

// 临时辅助函数：生成三合盘数据
function generateSanheGroups(): any[] {
  // 这个函数现在只是占位，实际的命宫索引会在组件中重新计算
  return [
    {
      centerPalace: 0, // 占位值，会在组件中重新计算
      relatedPalaces: [0, 4, 8, 6], // 占位值，会在组件中重新计算
      groupType: "命宫三方四正",
    },
  ];
}

// 临时辅助函数：生成四化盘数据
function generateSihuaDisplay(palaces: any[]): any {
  const sihua: { lu: any[]; quan: any[]; ke: any[]; ji: any[] } = {
    lu: [],
    quan: [],
    ke: [],
    ji: [],
  };
  palaces.forEach((palace) => {
    const allStars = [
      ...palace.majorStars,
      ...palace.minorStars,
      ...palace.adjectiveStars,
    ];
    allStars.forEach((star: any) => {
      if (star.mutagen) {
        switch (star.mutagen) {
          case "禄":
            sihua.lu.push(star);
            break;
          case "权":
            sihua.quan.push(star);
            break;
          case "科":
            sihua.ke.push(star);
            break;
          case "忌":
            sihua.ji.push(star);
            break;
        }
      }
    });
  });
  return sihua;
}
