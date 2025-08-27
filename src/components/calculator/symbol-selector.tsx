"use client";

interface SymbolSelectorProps {
  symbols: string[];
  value: string;
  onChange: (value: string) => void;
}

export function SymbolSelector({
  symbols,
  value,
  onChange,
}: SymbolSelectorProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">选择币种</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered w-full"
      >
        <option value="">请选择币种</option>
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
