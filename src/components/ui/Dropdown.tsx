import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAnchoredPopover } from "../../lib/use-anchored-popover";
import { Popover } from "./Popover";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  /** Muestra una opción extra para limpiar la selección. */
  allowClear?: boolean;
  clearLabel?: string;
  emptyLabel?: string;
}

const ESTIMATED_ITEM_HEIGHT = 40;
const MAX_VISIBLE_ITEMS = 6;

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  disabled = false,
  invalid = false,
  id,
  allowClear = false,
  clearLabel = "Todos",
  emptyLabel = "Sin opciones",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const estimatedHeight = Math.min(
    options.length + (allowClear ? 1 : 0),
    MAX_VISIBLE_ITEMS,
  ) * ESTIMATED_ITEM_HEIGHT + 12;

  const { containerRef, triggerRef, popoverRef, style, placement } = useAnchoredPopover({
    open: isOpen,
    onClose: () => setIsOpen(false),
    estimatedHeight,
  });

  const selected = options.find((option) => option.value === value);
  const opensUp = placement === "top";

  function handleSelect(next: string) {
    onChange(next);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-surface px-3.5 text-base text-foreground outline-none transition-colors",
          isOpen
            ? "border-primary"
            : invalid
              ? "border-danger"
              : "border-border hover:border-muted-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "",
        )}
      >
        <span className={cn("truncate", selected ? "text-foreground" : "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && opensUp ? "-rotate-180" : "",
            isOpen && !opensUp ? "rotate-180" : "",
          )}
        />
      </button>

      <Popover
        open={isOpen}
        popoverRef={popoverRef}
        style={style}
        className="max-h-60 overflow-y-auto p-1"
      >
        <ul role="listbox" className="flex flex-col">
          {allowClear && (
            <li>
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                  value === "" ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="truncate">{clearLabel}</span>
                {value === "" && <Check className="h-4 w-4 shrink-0" />}
              </button>
            </li>
          )}

          {options.length === 0 && !allowClear && (
            <li className="px-2.5 py-2 text-sm text-muted-foreground">{emptyLabel}</li>
          )}

          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                    isSelected ? "font-semibold text-foreground" : "text-foreground",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}
