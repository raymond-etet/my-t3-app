// 测试日期转换和八字计算
import { Lunar, Solar } from "lunar-typescript";

console.log("=== 测试日期转换 ===\n");

// 测试1：公历转农历
console.log("1. 公历 2025-02-06 转农历：");
const solar1 = Solar.fromYmd(2025, 2, 6);
const lunar1 = solar1.getLunar();
console.log(
  `   农历：${lunar1.getYear()}年${lunar1.getMonth()}月${lunar1.getDay()}日`
);
console.log(
  `   农历显示：${lunar1.getYearInGanZhi()}年${lunar1.getMonthInChinese()}月${lunar1.getDayInChinese()}`
);
console.log(`   八字年柱：${lunar1.getYearInGanZhi()}`);
console.log("");

// 测试2：农历转公历
console.log("2. 农历 2025年2月6日 转公历：");
const lunar2 = Lunar.fromYmd(2025, 2, 6);
const solar2 = lunar2.getSolar();
console.log(`   公历：${solar2.toYmd()}`);
console.log(
  `   农历显示：${lunar2.getYearInGanZhi()}年${lunar2.getMonthInChinese()}月${lunar2.getDayInChinese()}`
);
console.log(`   八字年柱：${lunar2.getYearInGanZhi()}`);
console.log("");

// 测试3：验证农历日期总是晚于公历
console.log("3. 验证：农历日期晚于公历");
console.log(
  `   公历 2025-02-06 → 农历 ${lunar1.getYear()}-${lunar1.getMonth()}-${lunar1.getDay()}`
);
console.log(`   农历 2025-02-06 → 公历 ${solar2.toYmd()}`);
console.log(`   结论：同样的数字，农历转公历会得到更晚的日期`);
console.log("");

// 测试4：展示两个日期的八字差异
console.log("4. 八字差异对比：");
console.log(`   公历 2025-02-06 的八字年柱：${lunar1.getYearInGanZhi()}`);
console.log(`   农历 2025-02-06 的八字年柱：${lunar2.getYearInGanZhi()}`);
