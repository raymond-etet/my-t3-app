"use client";

import { useState, useEffect } from "react";
import { SymbolSelector } from "./symbol-selector";
import { InputField } from "./input-field";
import { DisplayInfo } from "./display-info";
import { CalculationResults } from "./calculation-results";
import { useBinanceData } from "~/hooks/use-binance-data";
import { useCalculations } from "~/hooks/use-calculations";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "SOLUSDT"];

export function UContractCalculator() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [stopLossAmount, setStopLossAmount] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [leverage, setLeverage] = useState("");

  const {
    commissionRate,
    fundingRate,
    currentPrice,
    loading,
    error,
    fetchSymbolData,
  } = useBinanceData();

  const {
    requiredLeverage,
    requiredMargin,
    positionType,
    totalFee,
    calculate,
  } = useCalculations();

  // 当选择币种时获取数据
  useEffect(() => {
    if (symbol) {
      fetchSymbolData(symbol);
    }
  }, [symbol, fetchSymbolData]);

  // 当选择币种或价格更新时，自动填充开仓价
  useEffect(() => {
    if (symbol && currentPrice) {
      setEntryPrice(currentPrice.toString());
    }
  }, [symbol, currentPrice]);

  // 实时计算
  useEffect(() => {
    if (entryPrice && stopLossPrice && stopLossAmount) {
      calculate({
        entryPrice: parseFloat(entryPrice),
        stopLossPrice: parseFloat(stopLossPrice),
        stopLossAmount: parseFloat(stopLossAmount),
        leverage: leverage ? parseFloat(leverage) : undefined,
      });
    }
  }, [entryPrice, stopLossPrice, stopLossAmount, leverage, calculate]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入区域 */}
        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">交易参数设置</h2>

              <SymbolSelector
                symbols={SYMBOLS}
                value={symbol}
                onChange={setSymbol}
              />

              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="开仓价 (USDT)"
                  value={entryPrice}
                  onChange={setEntryPrice}
                  placeholder={currentPrice ? currentPrice.toString() : "0.00"}
                  type="number"
                  step="0.01"
                  button={{
                    text: "刷新",
                    onClick: () => {
                      if (symbol) {
                        fetchSymbolData(symbol);
                      }
                    },
                    className: "btn-secondary",
                  }}
                />

                <InputField
                  label="止损价 (USDT)"
                  value={stopLossPrice}
                  onChange={setStopLossPrice}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                />

                <InputField
                  label="止损金额 (USDT)"
                  value={stopLossAmount}
                  onChange={setStopLossAmount}
                  placeholder="50.00"
                  type="number"
                  step="0.01"
                />

                <InputField
                  label="止盈价 (USDT)"
                  value={takeProfitPrice}
                  onChange={setTakeProfitPrice}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                />

                <InputField
                  label="倍数"
                  value={leverage}
                  onChange={setLeverage}
                  placeholder="1-125"
                  type="number"
                  min="1"
                  max="125"
                  button={{
                    text: "最大倍数",
                    onClick: () => {
                      setLeverage("125");
                    },
                    className: "btn-secondary",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：显示区域 */}
        <div className="space-y-6">
          <CalculationResults
            requiredLeverage={requiredLeverage}
            requiredMargin={requiredMargin}
            positionType={positionType}
            hasLeverage={!!leverage}
            totalFee={totalFee}
          />
          <DisplayInfo
            symbol={symbol}
            commissionRate={commissionRate}
            fundingRate={fundingRate}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
