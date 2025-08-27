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
}

export function useCalculations() {
  const [result, setResult] = useState<CalculationResult>({
    requiredLeverage: null,
    requiredMargin: null,
    positionType: null,
  });

  const calculate = useCallback((params: CalculationParams) => {
    const { entryPrice, stopLossPrice, stopLossAmount, leverage } = params;

    if (!entryPrice || !stopLossPrice || !stopLossAmount) {
      setResult({
        requiredLeverage: null,
        requiredMargin: null,
        positionType: null,
      });
      return;
    }

    // 判断仓位类型
    const positionType: "long" | "short" =
      stopLossPrice < entryPrice ? "long" : "short";

    // 计算价格差异比例
    const priceDiff = Math.abs(entryPrice - stopLossPrice);
    const lossRatio = priceDiff / entryPrice;

    // 计算所需倍数（当没有输入倍数时）
    let requiredLeverage: number | null = null;
    if (!leverage) {
      // 所需仓位价值 = 止损金额 / 损失比例
      const requiredPositionValue = stopLossAmount / lossRatio;
      // 所需倍数 = 所需仓位价值 / 止损金额
      requiredLeverage = requiredPositionValue / stopLossAmount;
    }

    // 计算所需本金（当输入了倍数时）
    let requiredMargin: number | null = null;
    if (leverage) {
      // 所需仓位价值 = 止损金额 / 损失比例
      const requiredPositionValue = stopLossAmount / lossRatio;
      // 所需本金 = 所需仓位价值 / 倍数
      requiredMargin = requiredPositionValue / leverage;
    }

    setResult({
      requiredLeverage,
      requiredMargin,
      positionType,
    });
  }, []);

  return {
    ...result,
    calculate,
  };
}
