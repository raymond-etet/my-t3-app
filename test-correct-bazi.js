// 测试正确的八字计算逻辑
import { Lunar, Solar } from "lunar-typescript";

console.log("=== 验证正确的八字计算逻辑 ===\n");

// 测试公历 2025-01-09
console.log("测试：公历 2025-01-09");
const solar = Solar.fromYmd(2025, 1, 9);
const lunar = solar.getLunar();

console.log(`公历：${solar.toYmd()}`);
console.log(
  `对应农历：${lunar.getYear()}年${lunar.getMonth()}月${lunar.getDay()}日`
);
console.log(
  `农历显示：${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
);
console.log(`八字应该基于这个农历日期：`);
console.log(`  年柱：${lunar.getYearInGanZhi()}`);
console.log(`  月柱：${lunar.getMonthInGanZhi()}`);
console.log(`  日柱：${lunar.getDayInGanZhi()}`);
console.log("");

// 验证：公历2025-01-09 确实对应农历2024年12月10日
console.log("验证：");
console.log(
  `公历 2025-01-09 → 农历 ${lunar.getYear()}-${lunar.getMonth()}-${lunar.getDay()}`
);
console.log(
  `也就是农历 ${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
);
console.log("");

// 测试农历 2025-01-09
console.log("对比：农历 2025年1月9日");
const lunarDirect = Lunar.fromYmd(2025, 1, 9);
const solarFromLunar = lunarDirect.getSolar();
console.log(
  `农历：2025年1月9日（${lunarDirect.getYearInGanZhi()}年${lunarDirect.getMonthInChinese()}月${lunarDirect.getDayInChinese()}）`
);
console.log(`对应公历：${solarFromLunar.toYmd()}`);
console.log(`八字应该基于农历2025-01-09：`);
console.log(`  年柱：${lunarDirect.getYearInGanZhi()}`);
console.log(`  月柱：${lunarDirect.getMonthInGanZhi()}`);
console.log(`  日柱：${lunarDirect.getDayInGanZhi()}`);
