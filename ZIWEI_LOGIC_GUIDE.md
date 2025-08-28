# 紫微斗数排盘逻辑指南

## 概述

本项目基于 `react-iztro-main` 库的逻辑，实现了完整的紫微斗数排盘系统。系统支持公历和农历输入，能够自动处理日期转换并生成准确的命盘。

## 核心逻辑

### 1. 日期处理流程

#### 公历输入

```
用户输入公历日期 → 直接使用 iztro.astro.bySolar() 排盘 → 获取对应农历显示
```

#### 农历输入

```
用户输入农历日期 → 转换为公历日期 → 使用公历进行排盘 → 重新设置正确的农历八字
```

### 2. 关键实现细节

#### 时辰计算

```typescript
const hour = birthDateObj.hour();
const birthTimeIndex = Math.floor((hour + 1) / 2) % 12;
```

时辰索引对应关系：

- 0: 子时 (23:00-01:00)
- 1: 丑时 (01:00-03:00)
- 2: 寅时 (03:00-05:00)
- 3: 卯时 (05:00-07:00)
- 4: 辰时 (07:00-09:00)
- 5: 巳时 (09:00-11:00)
- 6: 午时 (11:00-13:00)
- 7: 未时 (13:00-15:00)
- 8: 申时 (15:00-17:00)
- 9: 酉时 (17:00-19:00)
- 10: 戌时 (19:00-21:00)
- 11: 亥时 (21:00-23:00)

#### 农历转公历

```typescript
// 创建农历对象
const lunarDateObj = Lunar.fromYmd(year, month, day);

// 获取对应的公历日期
const solarDateObj = lunarDateObj.getSolar();
const actualSolarDate = solarDateObj.toYmd();

// 格式化农历显示
const actualLunarDate = `${lunarDateObj.getYearInGanZhi()}年${lunarDateObj.getMonthInChinese()}月${lunarDateObj.getDayInChinese()}`;
```

#### 公历转农历

```typescript
// 创建公历对象
const solarDateObj = Solar.fromYmd(year, month, day);

// 获取对应的农历日期
const lunarDateObj = solarDateObj.getLunar();
const actualLunarDate = `${lunarDateObj.getYearInGanZhi()}年${lunarDateObj.getMonthInChinese()}月${lunarDateObj.getDayInChinese()}`;
```

### 3. 排盘核心

#### 使用 iztro 库

```typescript
const chart = iztro.astro.bySolar(
  actualSolarDate, // 公历日期（即使是农历输入也要转换）
  birthTimeIndex, // 时辰索引
  genderText, // 性别（男/女）
  true, // fixLeap
  "zh-CN" // 语言
);
```

#### 农历输入的八字修正

```typescript
if (lunar) {
  // 重要：重新设置正确的农历八字
  const correctChineseDate = `${lunarDateObj.getYearInGanZhi()} ${lunarDateObj.getMonthInGanZhi()} ${lunarDateObj.getDayInGanZhi()}`;
  chart.chineseDate = correctChineseDate;
  chart.isLunarInput = true;
}
```

## API 接口

### 请求参数

```typescript
{
  birth_date: string; // YYYY-MM-DD 格式
  birth_time: string; // HH:mm 格式
  gender: "male" | "female";
  lunar: boolean; // true=农历, false=公历
}
```

### 响应数据

```typescript
{
  gender: string;                    // 性别
  solarDate: string;                 // 公历日期
  lunarDate: string;                 // 农历日期
  chineseDate: string;               // 八字
  time: string;                      // 时辰
  timeRange: string;                 // 时辰范围
  sign: string;                      // 星座
  zodiac: string;                    // 生肖
  earthlyBranchOfBodyPalace: string; // 身宫地支
  earthlyBranchOfSoulPalace: string; // 命宫地支
  soul: string;                      // 命主
  body: string;                      // 身主
  fiveElementsClass: string;         // 五行局
  palaces: Palace[];                 // 12个宫位
  isLunarInput: boolean;             // 是否农历输入
  birthTimeIndex: number;            // 时辰索引
  originalInput: object;             // 原始输入参数
}
```

## 前端组件

### 主要组件

- `ZiweiChart`: 主排盘组件
- `ZiweiPalace`: 宫位显示组件
- `ZiweiTextChart`: 文字排盘组件

### 状态管理

- 支持图形和文字两种显示模式
- 实时错误处理和加载状态
- 响应式设计，支持移动端

## 测试验证

### 测试文件

- `test-new-ziwei-logic.js`: 核心逻辑测试
- `test-final-fix.js`: 最终修复验证
- `test-ziwei-fixed.js`: 紫微斗数修复测试

### 测试用例

1. **公历输入测试**: 验证公历日期的正确处理
2. **农历输入测试**: 验证农历转公历和八字修正
3. **时辰计算测试**: 验证时辰索引的准确性
4. **数据一致性测试**: 验证公历/农历转换的一致性

## 技术栈

### 核心库

- `iztro`: 紫微斗数排盘引擎
- `lunar-typescript`: 农历转换库
- `dayjs`: 日期处理库

### 前端框架

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 部署说明

### 环境要求

- Node.js 18+
- pnpm 或 npm

### 安装依赖

```bash
pnpm install
```

### 运行开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 注意事项

### 1. 农历处理

- 农历输入时，系统会自动转换为公历进行排盘
- 但八字会基于原始农历日期计算，确保准确性

### 2. 时辰计算

- 时辰索引从 0 开始，对应子时
- 子时跨越午夜，需要特殊处理

### 3. 数据验证

- 使用 Zod 进行参数验证
- 完整的错误处理和用户反馈

### 4. 性能优化

- 使用 React 的 useMemo 和 useCallback 优化渲染
- 异步 API 调用，避免阻塞 UI

## 更新日志

### v2.0.0 (2025-01-29)

- 重写排盘逻辑，基于 react-iztro-main 库
- 支持公历/农历双向转换
- 改进前端 UI 和用户体验
- 完善错误处理和数据验证

### v1.0.0 (2025-01-28)

- 初始版本
- 基础紫微斗数排盘功能
- 简单的公历输入支持

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License
