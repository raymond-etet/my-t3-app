/**
 * 测试脚本：验证紫微斗数日期类型修复
 * 用于测试公历和农历输入的正确处理
 */

const testCases = [
  {
    name: "公历输入测试 - 用户报告的问题",
    params: {
      birth_date: "2025-01-09",
      birth_time: "12:00",
      gender: "male",
      lunar: "false", // 字符串形式，模拟URL参数
    },
    expected: {
      solarDate: "2025-01-09",
      isLunarInput: false,
      description: "公历输入应该保持原始日期不变",
    },
  },
  {
    name: "农历输入测试 - 验证农历模式仍然正常",
    params: {
      birth_date: "2025-01-09",
      birth_time: "12:00",
      gender: "male",
      lunar: "true", // 字符串形式，模拟URL参数
    },
    expected: {
      isLunarInput: true,
      description: "农历输入应该转换为对应的公历日期",
    },
  },
  {
    name: "边界测试 - 布尔值true",
    params: {
      birth_date: "2025-01-09",
      birth_time: "12:00",
      gender: "male",
      lunar: true, // 真正的布尔值
    },
    expected: {
      isLunarInput: true,
      description: "布尔值true应该被正确识别为农历",
    },
  },
  {
    name: "边界测试 - 布尔值false",
    params: {
      birth_date: "2025-01-09",
      birth_time: "12:00",
      gender: "male",
      lunar: false, // 真正的布尔值
    },
    expected: {
      solarDate: "2025-01-09",
      isLunarInput: false,
      description: "布尔值false应该被正确识别为公历",
    },
  },
];

async function runTest(testCase) {
  console.log(`\n📋 测试: ${testCase.name}`);
  console.log(`📝 描述: ${testCase.expected.description}`);

  try {
    // 构建URL参数
    const params = new URLSearchParams();
    Object.entries(testCase.params).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    console.log(`🔗 请求参数: ${params.toString()}`);

    // 发送请求到本地API
    const response = await fetch(
      `http://localhost:3000/api/astrology/ziwei?${params}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    // 验证结果
    console.log(`✅ API响应成功`);
    console.log(`📊 关键结果:`);
    console.log(`   - 公历日期: ${data.solarDate}`);
    console.log(`   - 农历日期: ${data.lunarDate}`);
    console.log(`   - 是否农历输入: ${data.isLunarInput}`);
    console.log(`   - 原始输入lunar参数: ${data.originalInput?.lunar}`);

    // 验证期望结果
    if (
      testCase.expected.solarDate &&
      data.solarDate !== testCase.expected.solarDate
    ) {
      console.log(
        `❌ 公历日期不匹配! 期望: ${testCase.expected.solarDate}, 实际: ${data.solarDate}`
      );
      return false;
    }

    if (data.isLunarInput !== testCase.expected.isLunarInput) {
      console.log(
        `❌ 农历输入标记不匹配! 期望: ${testCase.expected.isLunarInput}, 实际: ${data.isLunarInput}`
      );
      return false;
    }

    console.log(`🎉 测试通过!`);
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log("🚀 开始紫微斗数日期类型修复验证测试\n");
  console.log("⚠️  请确保开发服务器正在运行 (pnpm dev)");

  let passedCount = 0;
  let totalCount = testCases.length;

  for (const testCase of testCases) {
    const passed = await runTest(testCase);
    if (passed) {
      passedCount++;
    }

    // 等待一下避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n📊 测试总结:`);
  console.log(`   - 总测试数: ${totalCount}`);
  console.log(`   - 通过数: ${passedCount}`);
  console.log(`   - 失败数: ${totalCount - passedCount}`);
  console.log(`   - 成功率: ${((passedCount / totalCount) * 100).toFixed(1)}%`);

  if (passedCount === totalCount) {
    console.log(`🎉 所有测试通过! 修复成功!`);
  } else {
    console.log(`⚠️  部分测试失败，需要进一步修复`);
  }
}

// 运行测试
runAllTests().catch(console.error);
