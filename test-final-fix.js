// 最终测试：验证农历/公历排盘的完整流程
import * as iztro from "iztro";
import { Lunar, Solar } from "lunar-typescript";

console.log("=== 最终测试：农历/公历排盘差异 ===\n");

// 测试配置
const testDate = "2025-02-06";
const birthTimeIndex = 6; // 午时
const gender = "男";
const lang = "zh-CN";

console.log(`测试日期：${testDate}`);
console.log(`时辰：午时 (11:00-13:00)`);
console.log(`性别：${gender}\n`);

// 场景1：作为公历日期排盘
console.log("场景1：用户选择【公历】");
console.log(`  输入：公历 ${testDate}`);

// 公历转农历
const solarObj = Solar.fromYmd(2025, 2, 6);
const lunarFromSolar = solarObj.getLunar();
const lunarDisplay1 = `${lunarFromSolar.getYearInGanZhi()}年${lunarFromSolar.getMonthInChinese()}月${lunarFromSolar.getDayInChinese()}`;

// 使用公历排盘
const chartBySolar = iztro.astro.bySolar(
  testDate,
  birthTimeIndex,
  gender,
  true,
  lang
);

console.log(`  对应农历：${lunarDisplay1}`);
console.log(`  八字：${chartBySolar.chineseDate}`);
console.log(`  命宫：${chartBySolar.palaces[0].name}`);
console.log(`  命宫主星：${chartBySolar.palaces[0].majorStars.join(", ")}`);

console.log("\n场景2：用户选择【农历】");
console.log(`  输入：农历 ${testDate}（农历2025年2月6日）`);

// 农历转公历
const lunarObj = Lunar.fromYmd(2025, 2, 6);
const solarFromLunar = lunarObj.getSolar();
const solarDisplay = solarFromLunar.toYmd();
const lunarDisplay2 = `${lunarObj.getYearInGanZhi()}年${lunarObj.getMonthInChinese()}月${lunarObj.getDayInChinese()}`;

// 重要：农历排盘应该使用转换后的公历日期
const chartByLunar = iztro.astro.bySolar(
  solarDisplay,
  birthTimeIndex,
  gender,
  true,
  lang
);

console.log(`  对应公历：${solarDisplay}`);
console.log(`  农历显示：${lunarDisplay2}`);
console.log(`  八字：${chartByLunar.chineseDate}`);
console.log(`  命宫：${chartByLunar.palaces[0].name}`);
console.log(`  命宫主星：${chartByLunar.palaces[0].majorStars.join(", ")}`);

// 对比结果
console.log("\n=== 结果对比 ===");
console.log(`同样输入"${testDate}"：`);
console.log(`  公历模式 → 八字：${chartBySolar.chineseDate}`);
console.log(`  农历模式 → 八字：${chartByLunar.chineseDate}`);
console.log(
  `  八字是否相同：${
    chartBySolar.chineseDate === chartByLunar.chineseDate
      ? "相同（错误！）"
      : "不同（正确！）"
  }`
);

// 验证日期差异
console.log("\n=== 验证日期差异 ===");
const date1 = new Date(testDate);
const date2 = new Date(solarDisplay);
const daysDiff = Math.floor(
  (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
);
console.log(`  公历 ${testDate} 与 公历 ${solarDisplay} 相差 ${daysDiff} 天`);
console.log(`  这就是为什么八字会完全不同！`);
