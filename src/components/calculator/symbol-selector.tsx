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
      <div className="flex flex-wrap gap-3">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            className={`btn btn-sm rounded-full px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md ${
              value === symbol
                ? "btn-primary text-white shadow-lg scale-105"
                : "bg-neutral text-neutral-content hover:bg-neutral-focus"
            }`}
            onClick={() => onChange(symbol)}
          >
            <span className="font-medium">{symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
