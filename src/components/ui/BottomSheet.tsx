import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Z_INDEX } from "../../lib/z-index";
import { lockScroll, unlockScroll } from "../../lib/scroll-lock";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Si es true no se puede cerrar tocando el fondo ni con Escape. */
  dismissible?: boolean;
}

const EXIT_DURATION = 220;

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  dismissible = true,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    lockScroll();
    return () => unlockScroll();
  }, [mounted]);

  useEffect(() => {
    if (!open || !dismissible) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, dismissible, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{ zIndex: Z_INDEX.sheet }}
      className="fixed inset-0 flex flex-col justify-end"
    >
      <div
        onClick={() => dismissible && onClose()}
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-[2px]",
          closing ? "animate-sheet-backdrop-out" : "animate-sheet-backdrop-in",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col rounded-t-3xl border-t border-border bg-surface shadow-2xl",
          closing ? "animate-sheet-panel-out" : "animate-sheet-panel-in",
        )}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-5 pt-3">
            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-lg font-semibold text-foreground">{title}</h2>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="safe-bottom border-t border-border px-5 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
