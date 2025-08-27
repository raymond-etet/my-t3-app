"use client";

import { useState, useCallback } from "react";

interface CalculationParams {
  entryPrice: number;
  stopLossPrice: number;
  stopLossAmount: number;
  leverage?: number;
}

interface CalculationResult {
  requiredLeverage: number | null;
  requiredMargin: number | null;
  positionType: "long" | "short" | null;
  totalFee: number | null;
}

export function useCalculations() {
  const [result, setResult] = useState<CalculationResult>({
    requiredLeverage: null,
    requiredMargin: null,
    positionType: null,
    totalFee: null,
  });

  const calculate = useCallback((params: CalculationParams) => {
    const { entryPrice, stopLossPrice, stopLossAmount, leverage } = params;

    if (!entryPrice || !stopLossPrice || !stopLossAmount) {
      setResult({
        requiredLeverage: null,
        requiredMargin: null,
        positionType: null,
        totalFee: null,
      });
      return;
    }

    // 判断仓位类型
    const positionType: "long" | "short" =
      stopLossPrice < entryPrice ? "long" : "short";

    // 计算价格差异比例
    const priceDiff = Math.abs(entryPrice - stopLossPrice);
    const lossRatio = priceDiff / entryPrice;

    // 固定手续费率（万2）
    const FEE_RATE = 0.0002;

    // 计算所需仓位价值 = 止损金额 / 损失比例
    const requiredPositionValue = stopLossAmount / lossRatio;

    // 计算所需倍数（当没有输入倍数时）
    let requiredLeverage: number | null = null;
    let totalFee: number | null = null;

    if (!leverage) {
      // 所需倍数 = 所需仓位价值 / 止损金额
      requiredLeverage = requiredPositionValue / stopLossAmount;
    }

    // 计算所需本金（当输入了倍数时）
    let requiredMargin: number | null = null;
    if (leverage) {
      // 所需本金 = 所需仓位价值 / 倍数
      requiredMargin = requiredPositionValue / leverage;

      // 确保所需本金大于止损金额
      if (requiredMargin < stopLossAmount) {
        // 调整杠杆倍数为最小值，使本金等于止损金额
        const minLeverage = requiredPositionValue / stopLossAmount;
        requiredMargin = requiredPositionValue / minLeverage;
      }
    } else {
      // 当没有输入倍数时，使用计算出的倍数计算本金
      if (requiredLeverage) {
        requiredMargin = requiredPositionValue / requiredLeverage;

        // 确保所需本金大于止损金额
        if (requiredMargin < stopLossAmount) {
          // 调整杠杆倍数为最小值，使本金等于止损金额
          const minLeverage = requiredPositionValue / stopLossAmount;
          requiredLeverage = minLeverage;
          requiredMargin = requiredPositionValue / minLeverage;
        }
      }
    }

    // 计算总手续费（开仓+平仓），仅用于显示
    totalFee = requiredPositionValue * 0.0002 * 2;

    setResult({
      requiredLeverage,
      requiredMargin,
      positionType,
      totalFee,
    });
  }, []);

  return {
    ...result,
    calculate,
  };
}
