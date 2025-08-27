"use client";

interface DisplayInfoProps {
  symbol: string;
  commissionRate: any;
  fundingRate: any;
  loading: boolean;
  error: string | null;
}

export function DisplayInfo({
  symbol,
  commissionRate,
  fundingRate,
  loading,
  error,
}: DisplayInfoProps) {
  if (loading) {
    return (
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">市场信息</h2>
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-error/10">
        <div className="card-body">
          <h2 className="card-title text-error">错误</h2>
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  if (!symbol) {
    return (
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">市场信息</h2>
          <p className="text-base-content/70">请先选择币种</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">市场信息 - {symbol}</h2>

        <div className="space-y-4">
          {/* 手续费率 */}
          <div>
            <h3 className="font-semibold text-base-content mb-2">手续费率</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="stat bg-base-100 rounded-lg">
                <div className="stat-title text-sm">Maker费率</div>
                <div className="stat-value text-lg">
                  {commissionRate?.makerCommissionRate
                    ? `${(
                        parseFloat(commissionRate.makerCommissionRate) * 100
                      ).toFixed(3)}%`
                    : "/"}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-lg">
                <div className="stat-title text-sm">Taker费率</div>
                <div className="stat-value text-lg">
                  {commissionRate?.takerCommissionRate
                    ? `${(
                        parseFloat(commissionRate.takerCommissionRate) * 100
                      ).toFixed(3)}%`
                    : "/"}
                </div>
              </div>
            </div>
          </div>

          {/* 资金费率 */}
          <div>
            <h3 className="font-semibold text-base-content mb-2">资金费率</h3>
            {fundingRate ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg">
                  <span className="text-sm">资金费率上限</span>
                  <span className="font-mono">
                    {(
                      parseFloat(fundingRate.adjustedFundingRateCap) * 100
                    ).toFixed(3)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg">
                  <span className="text-sm">资金费率下限</span>
                  <span className="font-mono">
                    {(
                      parseFloat(fundingRate.adjustedFundingRateFloor) * 100
                    ).toFixed(3)}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg">
                  <span className="text-sm">资金间隔</span>
                  <span className="font-mono">
                    {fundingRate.fundingIntervalHours}小时
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-base-content/70 text-sm">
                该币种使用标准资金费率
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
