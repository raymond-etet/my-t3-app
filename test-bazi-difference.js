// 测试不同日期的八字差异
import { Lunar, Solar } from "lunar-typescript";

console.log("=== 测试八字差异 ===\n");

// 测试案例1：公历 2025-01-10
console.log("案例1: 公历 2025-01-10");
const solar1 = Solar.fromYmd(2025, 1, 10);
const lunar1 = solar1.getLunar();
console.log(
  `  对应农历：${lunar1.getYearInGanZhi()}年${lunar1.getMonthInChinese()}月${lunar1.getDayInChinese()}`
);
console.log(
  `  八字：${lunar1.getYearInGanZhi()} ${lunar1.getMonthInGanZhi()} ${lunar1.getDayInGanZhi()}`
);
console.log("");

// 测试案例2：农历 2024年12月11日（与上面公历日期相同）
console.log("案例2: 农历 2024年12月11日（应该等于公历2025-01-10）");
const lunar2 = Lunar.fromYmd(2024, 12, 11);
const solar2 = lunar2.getSolar();
console.log(`  对应公历：${solar2.toYmd()}`);
console.log(
  `  八字：${lunar2.getYearInGanZhi()} ${lunar2.getMonthInGanZhi()} ${lunar2.getDayInGanZhi()}`
);
console.log("");

// 测试案例3：展示春节前后的八字变化
console.log("案例3: 春节前后的八字变化");
console.log("  2025-01-28（除夕前一天）:");
const beforeNY = Solar.fromYmd(2025, 1, 28);
const beforeNYLunar = beforeNY.getLunar();
console.log(
  `    农历：${beforeNYLunar.getYearInGanZhi()}年${beforeNYLunar.getMonthInChinese()}月${beforeNYLunar.getDayInChinese()}`
);
console.log(`    八字年柱：${beforeNYLunar.getYearInGanZhi()}`);

console.log("  2025-01-29（春节）:");
const newYear = Solar.fromYmd(2025, 1, 29);
const newYearLunar = newYear.getLunar();
console.log(
  `    农历：${newYearLunar.getYearInGanZhi()}年${newYearLunar.getMonthInChinese()}月${newYearLunar.getDayInChinese()}`
);
console.log(`    八字年柱：${newYearLunar.getYearInGanZhi()}`);
console.log("");

// 测试案例4：同一个输入数字，农历vs公历的八字差异
console.log('案例4: 输入"2025-02-15"，农历vs公历的差异');
console.log("  如果是公历2025-02-15:");
const solarDate = Solar.fromYmd(2025, 2, 15);
const solarToLunar = solarDate.getLunar();
console.log(
  `    转换后农历：${solarToLunar.getYearInGanZhi()}年${solarToLunar.getMonthInChinese()}月${solarToLunar.getDayInChinese()}`
);
console.log(
  `    八字：${solarToLunar.getYearInGanZhi()} ${solarToLunar.getMonthInGanZhi()} ${solarToLunar.getDayInGanZhi()}`
);

console.log("  如果是农历2025年2月15日:");
const lunarDate = Lunar.fromYmd(2025, 2, 15);
const lunarToSolar = lunarDate.getSolar();
console.log(`    对应公历：${lunarToSolar.toYmd()}`);
console.log(
  `    八字：${lunarDate.getYearInGanZhi()} ${lunarDate.getMonthInGanZhi()} ${lunarDate.getDayInGanZhi()}`
);
console.log("");

console.log("结论：同样的输入数字，选择农历或公历会得到完全不同的八字！");
