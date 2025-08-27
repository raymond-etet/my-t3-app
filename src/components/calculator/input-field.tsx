"use client";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  button?: {
    text: string;
    onClick: () => void;
    className?: string;
  };
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
  min,
  max,
  button,
}: InputFieldProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="join w-full">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          className="input input-bordered join-item flex-1"
        />
        {button && (
          <button
            type="button"
            onClick={button.onClick}
            className={`btn join-item ${button.className || "btn-primary"}`}
          >
            {button.text}
          </button>
        )}
      </div>
    </div>
  );
}
