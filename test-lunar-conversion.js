// 测试农历转换的准确性
const testLunarConversion = () => {
  console.log("🔍 测试农历转换准确性...\n");

  // 测试阳历 2025-02-06 应该转换为农历正月初九
  const testDate = "2025-02-06";
  console.log(`📅 测试阳历日期: ${testDate}`);

  try {
    // 使用 lunar-typescript 进行转换
    const solarDate = new Date(testDate);
    const lunarDate = require("lunar-typescript").Lunar.fromDate(solarDate);

    console.log("🌙 转换结果:");
    console.log(`  农历年: ${lunarDate.getYearInGanZhi()}`);
    console.log(`  农历月: ${lunarDate.getMonthInChinese()}`);
    console.log(`  农历日: ${lunarDate.getDayInChinese()}`);
    console.log(
      `  完整农历: ${lunarDate.getYearInGanZhi()}年${lunarDate.getMonthInChinese()}月${lunarDate.getDayInChinese()}`
    );

    // 验证是否正确
    const expectedMonth = "正月";
    const expectedDay = "初九";

    if (
      lunarDate.getMonthInChinese() === expectedMonth &&
      lunarDate.getDayInChinese() === expectedDay
    ) {
      console.log("✅ 农历转换正确！");
    } else {
      console.log("❌ 农历转换错误！");
      console.log(`期望: ${expectedMonth}${expectedDay}`);
      console.log(
        `实际: ${lunarDate.getMonthInChinese()}${lunarDate.getDayInChinese()}`
      );
    }

    // 反向验证：农历转阳历
    console.log("\n🔄 反向验证：农历转阳历");
    const reverseLunar = require("lunar-typescript").Lunar.fromYmd(2025, 1, 9); // 农历2025年正月初九
    const reverseSolar = reverseLunar.getSolar();
    console.log(`农历 2025年正月初九 → 阳历 ${reverseSolar.toYmd()}`);

    if (reverseSolar.toYmd() === testDate) {
      console.log("✅ 反向转换也正确！");
    } else {
      console.log("❌ 反向转换错误！");
    }
  } catch (error) {
    console.error("❌ 转换失败:", error.message);
  }
};

// 运行测试
testLunarConversion();
