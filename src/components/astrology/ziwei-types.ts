/**
 * @file 紫微斗数排盘数据类型定义
 * @description 根据 iztro 库返回的 JSON 数据结构创建的 TypeScript 类型接口。
 * @author Kilo Code
 * @date 2025-08-28
 */

// 定义星曜的基本结构
export interface Star {
  name: string; // 星曜名称，例如 "紫微"
  type: string; // 星曜类型，例如 "major", "minor"
  scope: "origin"; // 作用域，目前固定为 "origin"
  brightness?: string; // 亮度，例如 "庙", "旺", "陷"
  mutagen?: string; // 四化类型，例如 "禄", "权", "科", "忌"
}

// 定义宫位的结构
export interface Palace {
  index: number; // 宫位索引 (0-11)
  name: string; // 宫位名称，例如 "命宫"
  isBodyPalace: boolean; // 是否为身宫
  isOriginalPalace: boolean; // 是否为来因宫
  heavenlyStem: string; // 宫位天干
  earthlyBranch: string; // 宫位地支
  majorStars: Star[]; // 主星列表
  minorStars: Star[]; // 辅星/煞星列表
  adjectiveStars: Star[]; // 杂曜列表
  changsheng12: string; // 长生十二神
  boshi12: string; // 博士十二神
  jiangqian12: string; // 将前十二神
  suiqian12: string; // 岁前十二神
  decadal: {
    // 大限信息
    range: [number, number]; // 大限年龄范围
    heavenlyStem: string; // 大限天干
    earthlyBranch: string; // 大限地支
  };
  ages: number[]; // 流年岁数列表
  // 运限相关信息
  decadalName?: string; // 童限名称
  decadalStem?: string; // 童限天干
  yearlyStars?: string[]; // 流年星曜列表
}

// 定义整个命盘的顶层结构
export interface IztroChart {
  gender: "男" | "女"; // 性别
  solarDate: string; // 阳历日期
  lunarDate: string; // 农历日期
  chineseDate: string; // 干支日期
  time: string; // 时辰
  timeRange: string; // 时辰范围
  sign: string; // 星座
  zodiac: string; // 生肖
  earthlyBranchOfBodyPalace: string; // 身宫地支
  earthlyBranchOfSoulPalace: string; // 命宫地支
  soul: string; // 命主
  body: string; // 身主
  fiveElementsClass: string; // 五行局
  palaces: Palace[]; // 12个宫位的数组
}

// 排盘类型枚举
export type ChartType = "standard" | "flying" | "sanhe" | "sihua";

// 飞星盘特殊数据结构
export interface FlyingStarData {
  fromPalace: number; // 四化星飞出的宫位索引
  toPalace: number; // 四化星飞入的宫位索引
  starName: string; // 四化星名称
  mutagen: string; // 四化类型（禄权科忌）
  level: "life" | "decade" | "year" | "month"; // 四化层级
}

// 三合盘数据结构
export interface SanheGroup {
  centerPalace: number; // 中心宫位索引
  relatedPalaces: number[]; // 三方四正相关宫位索引
  groupType: string; // 三合组类型描述
}

// 四化盘数据结构
export interface SihuaDisplay {
  lu: Star[]; // 所有化禄星
  quan: Star[]; // 所有化权星
  ke: Star[]; // 所有化科星
  ji: Star[]; // 所有化忌星
}

// 扩展命盘数据，支持不同排盘类型
export interface ExtendedIztroChart extends IztroChart {
  chartType: ChartType;
  flyingStars?: FlyingStarData[]; // 飞星盘数据
  sanheGroups?: SanheGroup[]; // 三合盘数据
  sihuaDisplay?: SihuaDisplay; // 四化盘数据
}
