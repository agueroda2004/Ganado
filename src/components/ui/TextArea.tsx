import { cn } from "../../lib/utils";

interface TextAreaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  maxLength,
  rows = 4,
  className,
}: TextAreaProps) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      rows={rows}
      className={cn(
        "w-full resize-y rounded-xl border bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground",
        invalid ? "border-danger" : "border-border focus:border-primary",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className,
      )}
    />
  );
}
