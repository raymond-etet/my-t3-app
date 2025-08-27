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
      <div className="tabs tabs-boxed">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            className={`tab ${value === symbol ? "tab-active" : ""}`}
            onClick={() => onChange(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
