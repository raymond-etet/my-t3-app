// 测试修复后的紫微斗数排盘
import * as iztro from "iztro";
import { Lunar, Solar } from "lunar-typescript";

console.log("=== 测试修复后的排盘逻辑 ===\n");

const birthTimeIndex = 6; // 午时
const gender = "男";
const lang = "zh-CN";

// 测试案例：公历 2025-01-09
console.log("案例1: 公历 2025-01-09");
const solarInput = Solar.fromYmd(2025, 1, 9);
const lunarFromSolar = solarInput.getLunar();

console.log(`输入：公历 2025-01-09`);
console.log(
  `对应农历：${lunarFromSolar.getYear()}年${lunarFromSolar.getMonth()}月${lunarFromSolar.getDay()}日`
);
console.log(
  `农历显示：${lunarFromSolar.getYearInGanZhi()}年${lunarFromSolar.getMonthInChinese()}月${lunarFromSolar.getDayInChinese()}`
);
console.log(
  `正确八字：${lunarFromSolar.getYearInGanZhi()} ${lunarFromSolar.getMonthInGanZhi()} ${lunarFromSolar.getDayInGanZhi()}`
);

// iztro排盘（但要用正确的农历八字）
const chart1 = iztro.astro.bySolar(
  "2025-01-09",
  birthTimeIndex,
  gender,
  true,
  lang
);
console.log(`iztro原始八字：${chart1.chineseDate}`);
console.log(
  `应该修正为：${lunarFromSolar.getYearInGanZhi()} ${lunarFromSolar.getMonthInGanZhi()} ${lunarFromSolar.getDayInGanZhi()}`
);

console.log("\n案例2: 农历 2025年1月9日");
const lunarInput = Lunar.fromYmd(2025, 1, 9);
const solarFromLunar = lunarInput.getSolar();

console.log(`输入：农历 2025年1月9日`);
console.log(`对应公历：${solarFromLunar.toYmd()}`);
console.log(
  `农历显示：${lunarInput.getYearInGanZhi()}年${lunarInput.getMonthInChinese()}月${lunarInput.getDayInChinese()}`
);
console.log(
  `正确八字：${lunarInput.getYearInGanZhi()} ${lunarInput.getMonthInGanZhi()} ${lunarInput.getDayInGanZhi()}`
);

console.log("\n=== 验证差异 ===");
console.log(
  `公历2025-01-09的八字：${lunarFromSolar.getYearInGanZhi()} ${lunarFromSolar.getMonthInGanZhi()} ${lunarFromSolar.getDayInGanZhi()}`
);
console.log(
  `农历2025-01-09的八字：${lunarInput.getYearInGanZhi()} ${lunarInput.getMonthInGanZhi()} ${lunarInput.getDayInGanZhi()}`
);
console.log(
  `八字是否不同：${
    lunarFromSolar.getDayInGanZhi() !== lunarInput.getDayInGanZhi()
      ? "是（正确）"
      : "否（错误）"
  }`
);
