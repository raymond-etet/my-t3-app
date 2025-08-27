"use client";

import { useState, useCallback } from "react";

interface CommissionRate {
  symbol: string;
  makerCommissionRate: string;
  takerCommissionRate: string;
}

interface FundingRate {
  symbol: string;
  adjustedFundingRateCap: string;
  adjustedFundingRateFloor: string;
  fundingIntervalHours: number;
}

interface BinanceData {
  commissionRate: CommissionRate | null;
  fundingRate: FundingRate | null;
  currentPrice: number | null;
  loading: boolean;
  error: string | null;
}

export function useBinanceData() {
  const [data, setData] = useState<BinanceData>({
    commissionRate: null,
    fundingRate: null,
    currentPrice: null,
    loading: false,
    error: null,
  });

  const fetchSymbolData = useCallback(async (symbol: string) => {
    setData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 获取手续费率
      const commissionRes = await fetch(
        `https://fapi.binance.com/fapi/v1/commissionRate?symbol=${symbol}`
      );
      const commissionRate = await commissionRes.json();

      // 获取资金费率信息
      const fundingRes = await fetch(
        `https://fapi.binance.com/fapi/v1/fundingInfo`
      );
      const fundingData = await fundingRes.json();
      const fundingRate = fundingData.find(
        (item: FundingRate) => item.symbol === symbol
      );

      // 获取最新价格
      const priceRes = await fetch(
        `https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`
      );
      const priceData = await priceRes.json();

      setData({
        commissionRate,
        fundingRate: fundingRate || null,
        currentPrice: parseFloat(priceData.price),
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("获取Binance数据失败:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "获取数据失败，请稍后重试",
      }));
    }
  }, []);

  return {
    ...data,
    fetchSymbolData,
  };
}
