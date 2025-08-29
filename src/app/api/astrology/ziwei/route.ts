import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { astro } from "iztro";

/**
 * @file 紫微斗数排盘 API - 完全照搬react-iztro-main的逻辑
 * @description 使用与react-iztro-main相同的参数格式和调用方式
 */

// 时辰映射表 - 照搬react-iztro-main的逻辑
const TIME_MAPPING = [
  "23:00-01:00", // 0: 子时
  "01:00-03:00", // 1: 丑时
  "03:00-05:00", // 2: 寅时
  "05:00-07:00", // 3: 卯时
  "07:00-09:00", // 4: 辰时
  "09:00-11:00", // 5: 巳时
  "11:00-13:00", // 6: 午时
  "13:00-15:00", // 7: 未时
  "15:00-17:00", // 8: 申时
  "17:00-19:00", // 9: 酉时
  "19:00-21:00", // 10: 戌时
  "21:00-23:00", // 11: 亥时
];

// 定义请求参数的 Zod 验证模式 - 照搬react-iztro-main的参数格式
const ziweiSchema = z.object({
  birthday: z.string(), // 格式: "2025-01-29"
  birthTime: z.number().min(0).max(12), // 时辰索引: 0-12
  gender: z.enum(["male", "female"]),
  birthdayType: z.enum(["solar", "lunar"]).default("solar"),
  fixLeap: z.boolean().default(true),
  isLeapMonth: z.boolean().default(false),
  lang: z.string().default("zh-CN"),
  astroType: z.enum(["heaven", "earth", "human"]).default("heaven"),
});

export async function GET(request: NextRequest) {
  try {
    // 1. 从请求的 URL 中提取查询参数 - 转换为react-iztro-main格式
    const searchParams = request.nextUrl.searchParams;

    // 将传统API参数转换为react-iztro-main格式
    const birthDate = searchParams.get("birth_date") || "";
    const birthTimeStr = searchParams.get("birth_time") || "";
    const genderStr = searchParams.get("gender") || "";
    const lunarStr = searchParams.get("lunar") || "false";

    // 转换时间为时辰索引
    const [hourStr] = birthTimeStr.split(":");
    const hour = parseInt(hourStr || "0") || 0;
    let birthTimeIndex = 0;
    if (hour >= 23 || hour < 1) birthTimeIndex = 0; // 子时
    else if (hour >= 1 && hour < 3) birthTimeIndex = 1; // 丑时
    else if (hour >= 3 && hour < 5) birthTimeIndex = 2; // 寅时
    else if (hour >= 5 && hour < 7) birthTimeIndex = 3; // 卯时
    else if (hour >= 7 && hour < 9) birthTimeIndex = 4; // 辰时
    else if (hour >= 9 && hour < 11) birthTimeIndex = 5; // 巳时
    else if (hour >= 11 && hour < 13) birthTimeIndex = 6; // 午时
    else if (hour >= 13 && hour < 15) birthTimeIndex = 7; // 未时
    else if (hour >= 15 && hour < 17) birthTimeIndex = 8; // 申时
    else if (hour >= 17 && hour < 19) birthTimeIndex = 9; // 酉时
    else if (hour >= 19 && hour < 21) birthTimeIndex = 10; // 戌时
    else if (hour >= 21 && hour < 23) birthTimeIndex = 11; // 亥时

    // 构建react-iztro-main格式的参数 - 尝试不同的astroType
    const astroTypeParam = searchParams.get("astroType") || "heaven";
    const params = {
      birthday: birthDate,
      birthTime: birthTimeIndex,
      gender: genderStr as "male" | "female",
      birthdayType:
        lunarStr === "true" ? "lunar" : ("solar" as "solar" | "lunar"),
      fixLeap: true,
      isLeapMonth: false,
      lang: "zh-CN",
      astroType: astroTypeParam as "heaven" | "earth" | "human",
    };

    // 2. 使用 Zod 验证和解析参数
    const validatedParams = ziweiSchema.parse(params);
    const {
      birthday,
      birthTime,
      gender,
      birthdayType,
      fixLeap,
      isLeapMonth,
      lang,
      astroType,
    } = validatedParams;

    console.log("=== 使用react-iztro-main格式排盘 ===");
    console.log("参数:", {
      birthday,
      birthTime,
      gender,
      birthdayType,
      fixLeap,
      isLeapMonth,
      lang,
      astroType,
    });

    // 3. 配置iztro库使用正确的年分界点 - 修复排盘错误
    // 关键修复：使用正月初一作为年分界点，而不是立春
    astro.config({
      yearDivide: "normal", // 正月初一分界，而不是立春分界
      algorithm: "default", // 使用默认算法
    });

    let chart;
    const genderText = gender === "male" ? "男" : "女";

    if (birthdayType === "lunar") {
      // 农历排盘
      chart = astro.byLunar(
        birthday,
        birthTime,
        genderText,
        isLeapMonth,
        fixLeap,
        lang
      );
    } else {
      // 公历排盘
      chart = astro.bySolar(birthday, birthTime, genderText, fixLeap, lang);
    }

    console.log("排盘完成:", {
      八字: chart.chineseDate,
      命宫: chart.earthlyBranchOfSoulPalace,
      身宫: chart.earthlyBranchOfBodyPalace,
      五行局: chart.fiveElementsClass,
    });

    // 4. 构建返回数据 - 保持与原API兼容的格式
    const responseData = {
      gender: genderText,
      solarDate: birthday,
      lunarDate: chart.lunarDate || "",
      chineseDate: chart.chineseDate,
      time: chart.time,
      timeRange: TIME_MAPPING[birthTime] || "未知",
      sign: chart.sign,
      zodiac: chart.zodiac,
      earthlyBranchOfBodyPalace: chart.earthlyBranchOfBodyPalace,
      earthlyBranchOfSoulPalace: chart.earthlyBranchOfSoulPalace,
      soul: chart.soul,
      body: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      palaces: chart.palaces.map((palace: any, index: number) => ({
        ...palace,
        index: index,
        isBodyPalace: palace.isBodyPalace,
        isSoulPalace: palace.earthlyBranch === chart.earthlyBranchOfSoulPalace,
      })),
      isLunarInput: birthdayType === "lunar",
      birthTimeIndex: birthTime,
      originalInput: {
        birth_date: birthday,
        birth_time: birthTimeStr,
        gender: gender,
        lunar: lunarStr,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("紫微斗数排盘失败:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "排盘过程中发生未知错误" },
      { status: 500 }
    );
  }
}
