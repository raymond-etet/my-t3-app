"use client";

interface CalculationResultsProps {
  requiredLeverage: number | null;
  requiredMargin: number | null;
  positionType: "long" | "short" | null;
  hasLeverage: boolean;
  totalFee?: number | null;
}

export function CalculationResults({
  requiredLeverage,
  requiredMargin,
  positionType,
  hasLeverage,
  totalFee,
}: CalculationResultsProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(4).replace(/\.?0+$/, "");
  };

  return (
    <div className="card bg-primary/10">
      <div className="card-body">
        <h2 className="card-title">计算结果</h2>

        {positionType && (
          <div className="mb-4">
            <div
              className={`badge ${
                positionType === "long" ? "badge-success" : "badge-error"
              } gap-2`}
            >
              {positionType === "long" ? "📈 做多" : "📉 做空"}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {!hasLeverage && requiredLeverage !== null && (
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title text-sm">所需倍数</div>
              <div className="stat-value text-primary text-2xl">
                {formatNumber(requiredLeverage)}x
              </div>
              <div className="stat-desc text-xs">
                达到止损金额所需的杠杆倍数
              </div>
            </div>
          )}

          {hasLeverage && requiredMargin !== null && (
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title text-sm">所需本金</div>
              <div className="stat-value text-primary text-2xl">
                {formatNumber(requiredMargin)} USDT
              </div>
              <div className="stat-desc text-xs">
                在当前倍数下达到止损金额所需的本金
              </div>
            </div>
          )}
          {totalFee && totalFee > 0 && (
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title text-sm">总手续费</div>
              <div className="stat-value text-warning text-xl">
                {totalFee.toFixed(4)} USDT
              </div>
              <div className="stat-desc text-xs">开仓+平仓手续费（万2×2）</div>
            </div>
          )}

          {requiredLeverage === null && requiredMargin === null && (
            <div className="text-center py-8 text-base-content/70">
              <p>请输入完整的交易参数</p>
              <p className="text-sm mt-2">
                需要：开仓价、止损价、止损金额
                {!hasLeverage && "（可选：倍数）"}
                {hasLeverage && "和倍数"}
              </p>
            </div>
          )}

          {requiredLeverage !== null &&
            requiredLeverage > 125 &&
            !hasLeverage && (
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>警告：所需倍数超过125倍限制，请调整参数</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
