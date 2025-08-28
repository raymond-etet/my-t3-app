// 测试新的紫微斗数排盘逻辑
import * as iztro from "iztro";
import { Lunar, Solar } from "lunar-typescript";

console.log("=== 测试新的紫微斗数排盘逻辑 ===\n");

// 测试配置
const testConfigs = [
  {
    name: "公历输入测试",
    input: {
      birth_date: "2025-02-06",
      birth_time: "12:00",
      gender: "male",
      lunar: false,
    },
  },
  {
    name: "农历输入测试",
    input: {
      birth_date: "2025-01-09", // 农历2025年正月初九
      birth_time: "12:00",
      gender: "male",
      lunar: true,
    },
  },
];

// 时辰索引计算函数
function calculateBirthTimeIndex(birthTime) {
  const [hour] = birthTime.split(":").map(Number);
  return Math.floor((hour + 1) / 2) % 12;
}

// 时辰范围显示函数
function getTimeRange(timeIndex) {
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

// 测试函数
async function testZiweiLogic() {
  for (const config of testConfigs) {
    console.log(`\n🔍 ${config.name}`);
    console.log("=".repeat(50));

    const { birth_date, birth_time, gender, lunar } = config.input;

    console.log(`输入参数:`);
    console.log(`  日期: ${birth_date}`);
    console.log(`  时间: ${birth_time}`);
    console.log(`  性别: ${gender}`);
    console.log(`  历法: ${lunar ? "农历" : "公历"}`);

    // 计算时辰索引
    const birthTimeIndex = calculateBirthTimeIndex(birth_time);
    const timeRange = getTimeRange(birthTimeIndex);
    console.log(`\n时辰计算:`);
    console.log(`  时辰索引: ${birthTimeIndex}`);
    console.log(`  时辰范围: ${timeRange}`);

    try {
      let chart;
      let actualLunarDate;
      let actualSolarDate;
      let isLunarInput = false;

      if (lunar) {
        // 农历输入处理
        console.log(`\n🌙 农历输入处理:`);

        const dateParts = birth_date.split("-").map(Number);
        const [year, month, day] = dateParts;

        // 创建农历对象
        const lunarDateObj = Lunar.fromYmd(year, month, day);

        // 获取对应的公历日期（用于 iztro 排盘）
        const solarDateObj = lunarDateObj.getSolar();
        actualSolarDate = solarDateObj.toYmd();

        // 格式化农历显示
        actualLunarDate = `${lunarDateObj.getYearInGanZhi()}年${lunarDateObj.getMonthInChinese()}月${lunarDateObj.getDayInChinese()}`;

        console.log(`  农历输入: ${birth_date}`);
        console.log(`  农历格式化: ${actualLunarDate}`);
        console.log(`  对应公历: ${actualSolarDate}`);

        // 使用转换后的公历日期进行排盘
        chart = iztro.astro.bySolar(
          actualSolarDate,
          birthTimeIndex,
          gender === "male" ? "男" : "女",
          true, // fixLeap
          "zh-CN"
        );

        // 重要：重新设置正确的农历八字
        const correctChineseDate = `${lunarDateObj.getYearInGanZhi()} ${lunarDateObj.getMonthInGanZhi()} ${lunarDateObj.getDayInGanZhi()}`;
        chart.chineseDate = correctChineseDate;
        chart.isLunarInput = true;

        isLunarInput = true;
      } else {
        // 公历输入处理
        console.log(`\n☀️ 公历输入处理:`);

        // 直接使用公历日期进行排盘
        chart = iztro.astro.bySolar(
          birth_date,
          birthTimeIndex,
          gender === "male" ? "男" : "女",
          true, // fixLeap
          "zh-CN"
        );

        // 获取对应的农历日期用于显示
        const dateParts = birth_date.split("-").map(Number);
        const solarDateObj = Solar.fromYmd(
          dateParts[0],
          dateParts[1],
          dateParts[2]
        );
        const lunarDateObj = solarDateObj.getLunar();
        actualLunarDate = `${lunarDateObj.getYearInGanZhi()}年${lunarDateObj.getMonthInChinese()}月${lunarDateObj.getDayInChinese()}`;
        actualSolarDate = birth_date;

        console.log(`  公历输入: ${birth_date}`);
        console.log(`  对应农历: ${actualLunarDate}`);

        isLunarInput = false;
      }

      // 显示排盘结果
      console.log(`\n📊 排盘结果:`);
      console.log(`  八字: ${chart.chineseDate}`);
      console.log(`  命宫: ${chart.earthlyBranchOfSoulPalace}`);
      console.log(`  身宫: ${chart.earthlyBranchOfBodyPalace}`);
      console.log(`  五行局: ${chart.fiveElementsClass}`);
      console.log(`  命主: ${chart.soul}`);
      console.log(`  身主: ${chart.body}`);
      console.log(`  生肖: ${chart.zodiac}`);
      console.log(`  星座: ${chart.sign}`);

      // 验证数据一致性
      console.log(`\n✅ 数据验证:`);
      console.log(`  输入类型: ${isLunarInput ? "农历" : "公历"}`);
      console.log(`  公历日期: ${actualSolarDate}`);
      console.log(`  农历日期: ${actualLunarDate}`);

      if (lunar) {
        // 验证农历输入的八字是否正确
        const expectedLunar = Lunar.fromYmd(
          parseInt(birth_date.split("-")[0]),
          parseInt(birth_date.split("-")[1]),
          parseInt(birth_date.split("-")[2])
        );
        const expectedBazi = `${expectedLunar.getYearInGanZhi()} ${expectedLunar.getMonthInGanZhi()} ${expectedLunar.getDayInGanZhi()}`;

        if (chart.chineseDate === expectedBazi) {
          console.log(`  ✅ 农历八字计算正确`);
        } else {
          console.log(`  ❌ 农历八字计算错误`);
          console.log(`    期望: ${expectedBazi}`);
          console.log(`    实际: ${chart.chineseDate}`);
        }
      }
    } catch (error) {
      console.error(`  ❌ 排盘失败:`, error.message);
    }
  }
}

// 运行测试
testZiweiLogic().catch(console.error);
