import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as iztro from "iztro";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Lunar, Solar } from "lunar-typescript";

// 扩展 dayjs 以支持时区
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @file 紫微斗数排盘 API
 * @description 该 API 接收出生信息，使用 iztro 库计算命盘，并返回详细的 JSON 数据。
 * 支持公历和农历输入，自动处理日期转换。
 * @author Kilo Code
 * @date 2025-08-28
 */

// 定义请求参数的 Zod 验证模式
const ziweiSchema = z.object({
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式必须是 YYYY-MM-DD"),
  birth_time: z.string().regex(/^\d{2}:\d{2}$/, "时间格式必须是 HH:mm"),
  gender: z.enum(["male", "female"], { message: "无效的性别" }),
  // 修复：正确解析字符串形式的布尔值
  lunar: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
});

export async function GET(request: NextRequest) {
  try {
    // 1. 从请求的 URL 中提取查询参数
    const searchParams = request.nextUrl.searchParams;
    const params = {
      birth_date: searchParams.get("birth_date") || "",
      birth_time: searchParams.get("birth_time") || "",
      gender: searchParams.get("gender") || "",
      lunar: searchParams.get("lunar") || "false",
    };

    // 2. 使用 Zod 验证和解析参数
    const validatedParams = ziweiSchema.parse(params);
    const { birth_date, birth_time, gender, lunar } = validatedParams;

    console.log("=== API 参数解析调试 ===");
    console.log("1. 原始 URL 参数:", {
      birth_date: searchParams.get("birth_date"),
      birth_time: searchParams.get("birth_time"),
      gender: searchParams.get("gender"),
      lunar: searchParams.get("lunar"),
    });
    console.log("2. Zod 验证后的参数:", {
      birth_date,
      birth_time,
      gender,
      lunar,
      lunar_type: typeof lunar,
    });

    // 3. 处理时间和时辰
    const fullDateTimeStr = `${birth_date} ${birth_time}`;
    const birthDateObj = dayjs.tz(
      fullDateTimeStr,
      "YYYY-MM-DD HH:mm",
      "Asia/Shanghai"
    );

    const hour = birthDateObj.hour();
    // 时辰索引计算：0=子时(23:00-01:00), 1=丑时(01:00-03:00), ..., 11=亥时(21:00-23:00)
    const birthTimeIndex = Math.floor((hour + 1) / 2) % 12;

    console.log("处理后的参数:", {
      hour,
      birthTimeIndex,
      timeRange: getTimeRange(birthTimeIndex),
    });

    // 4. 设置 iztro 语言和性别
    const lang = "zh-CN";
    const genderText = gender === "male" ? "男" : "女";

    // 5. 处理日期转换和排盘
    let chart: any;
    let actualLunarDate: string;
    let actualSolarDate: string;
    let isLunarInput: boolean = false;

    console.log("3. 日期类型判断:", {
      lunar_value: lunar,
      will_process_as: lunar ? "农历模式" : "公历模式",
    });

    if (lunar) {
      // 用户输入的是农历日期
      console.log("🌙 处理农历输入:", birth_date);
      isLunarInput = true;

      try {
        // 解析农历日期
        const dateParts = birth_date.split("-").map(Number);
        if (dateParts.length !== 3 || dateParts.some(isNaN)) {
          throw new Error("农历日期格式无效");
        }

        const [year, month, day] = dateParts;

        // 确保数据类型正确
        if (!year || !month || !day) {
          throw new Error("农历日期解析失败：年月日不能为空");
        }

        // 创建农历对象
        const lunarDateObj = Lunar.fromYmd(year, month, day);

        // 获取对应的公历日期（用于 iztro 排盘）
        const solarDateObj = lunarDateObj.getSolar();
        actualSolarDate = solarDateObj.toYmd();

        // 格式化农历显示
        actualLunarDate = `${lunarDateObj.getYearInGanZhi()}年${lunarDateObj.getMonthInChinese()}月${lunarDateObj.getDayInChinese()}`;

        console.log("农历转公历:", {
          农历输入: birth_date,
          农历格式化: actualLunarDate,
          对应公历: actualSolarDate,
        });

        // 使用转换后的公历日期进行排盘
        chart = iztro.astro.bySolar(
          actualSolarDate,
          birthTimeIndex,
          genderText,
          true, // fixLeap
          lang
        );

        // 重要：重新设置正确的农历八字
        const correctChineseDate = `${lunarDateObj.getYearInGanZhi()} ${lunarDateObj.getMonthInGanZhi()} ${lunarDateObj.getDayInGanZhi()}`;
        chart.chineseDate = correctChineseDate;
        chart.isLunarInput = true;
      } catch (error) {
        console.error("农历日期处理失败:", error);
        throw new Error("农历日期转换失败，请检查日期是否有效");
      }
    } else {
      // 用户输入的是公历日期
      console.log("☀️ 处理公历输入:", birth_date);
      isLunarInput = false;

      try {
        // 直接使用公历日期进行排盘
        chart = iztro.astro.bySolar(
          birth_date,
          birthTimeIndex,
          genderText,
          true, // fixLeap
          lang
        );

        // 获取对应的农历日期用于显示
        const dateParts = birth_date.split("-").map(Number);
        if (dateParts.length !== 3 || dateParts.some(isNaN)) {
          throw new Error("公历日期格式无效");
        }
        const solarDateObj = Solar.fromYmd(
          dateParts[0] as number,
          dateParts[1] as number,
          dateParts[2] as number
        );
        const lunarDateObj = solarDateObj.getLunar();
        actualLunarDate = `${lunarDateObj.getYearInGanZhi()}年${lunarDateObj.getMonthInChinese()}月${lunarDateObj.getDayInChinese()}`;
        actualSolarDate = birth_date;

        console.log("公历转农历:", {
          公历输入: birth_date,
          对应农历: actualLunarDate,
        });
      } catch (error) {
        console.error("公历日期处理失败:", error);
        throw new Error("公历日期处理失败，请检查日期是否有效");
      }
    }

    // 6. 构建返回数据
    const responseData = {
      gender: genderText,
      solarDate: actualSolarDate,
      lunarDate: actualLunarDate,
      chineseDate: chart.chineseDate,
      time: chart.time,
      timeRange: chart.timeRange,
      sign: chart.sign,
      zodiac: chart.zodiac,
      earthlyBranchOfBodyPalace: chart.earthlyBranchOfBodyPalace,
      earthlyBranchOfSoulPalace: chart.earthlyBranchOfSoulPalace,
      soul: chart.soul,
      body: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      palaces: chart.palaces,
      isLunarInput,
      birthTimeIndex,
      originalInput: {
        birth_date,
        birth_time,
        gender,
        lunar,
      },
    };

    console.log("排盘完成，返回数据:", {
      八字: chart.chineseDate,
      命宫: chart.earthlyBranchOfSoulPalace,
      身宫: chart.earthlyBranchOfBodyPalace,
      五行局: chart.fiveElementsClass,
    });

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

/**
 * 根据时辰索引获取时辰范围
 */
function getTimeRange(timeIndex: number): string {
  const timeRanges = [
    "23:00-01:00", // 子时
    "01:00-03:00", // 丑时
    "03:00-05:00", // 寅时
    "05:00-07:00", // 卯时
    "07:00-09:00", // 辰时
    "09:00-11:00", // 巳时
    "11:00-13:00", // 午时
    "13:00-15:00", // 未时
    "15:00-17:00", // 申时
    "17:00-19:00", // 酉时
    "19:00-21:00", // 戌时
    "21:00-23:00", // 亥时
  ];
  return timeRanges[timeIndex] || "未知";
}
