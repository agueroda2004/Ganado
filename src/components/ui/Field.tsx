import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, optional = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
