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
}: InputFieldProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        className="input input-bordered w-full"
      />
    </div>
  );
}
