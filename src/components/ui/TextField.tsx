import type { RefObject } from "react";
import { cn } from "../../lib/utils";

interface TextFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "search";
  autoFocus?: boolean;
  className?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  ariaLabel?: string;
}

export function TextField({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  maxLength,
  inputMode = "text",
  autoFocus = false,
  className,
  inputRef,
  ariaLabel,
}: TextFieldProps) {
  return (
    <input
      id={id}
      ref={inputRef}
      aria-label={ariaLabel}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      inputMode={inputMode}
      autoFocus={autoFocus}
      className={cn(
        "h-11 w-full rounded-xl border bg-surface px-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground",
        invalid ? "border-danger" : "border-border focus:border-primary",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className,
      )}
    />
  );
}
