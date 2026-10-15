import { createPortal } from "react-dom";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { cn } from "../../lib/utils";

interface PopoverProps {
  open: boolean;
  popoverRef: RefObject<HTMLDivElement | null>;
  style?: CSSProperties;
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

export function Popover({
  open,
  popoverRef,
  style,
  inline = false,
  className,
  children,
}: PopoverProps) {
  if (!open) {
    return null;
  }
  const content = (
    <div
      ref={popoverRef}
      role="dialog"
      style={style}
      className={cn("rounded-lg border border-border bg-surface shadow-lg", className)}
    >
      {children}
    </div>
  );
  return inline ? content : createPortal(content, document.body);
}
