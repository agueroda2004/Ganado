import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAnchoredPopover } from "../../lib/use-anchored-popover";
import { Popover } from "./Popover";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS_OF_WEEK = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

const ESTIMATED_POPOVER_HEIGHT = 360;

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function toDate(iso: string): Date | null {
  if (!iso) return null;
  const datePart = iso.includes("T") ? iso.split("T")[0] : iso;
  const d = new Date(`${datePart}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(iso: string): string {
  const d = toDate(iso);
  if (!d) return "";
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  maxDate?: Date;
  minDate?: Date;
  inline?: boolean;
  id?: string;
}

const NAV_BUTTON_CLASSES =
  "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent";

const CELL_BASE_CLASSES = "rounded-md text-sm transition-colors disabled:cursor-not-allowed";

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  disabled = false,
  invalid = false,
  maxDate,
  minDate,
  inline = false,
  id,
}: DatePickerProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const effectiveMax = maxDate
    ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    : undefined;
  const effectiveMin = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : undefined;

  const initialDate = toDate(value) ?? today;
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");
  const [yearPage, setYearPage] = useState(0);

  const { containerRef, triggerRef, popoverRef, style } = useAnchoredPopover({
    open: isOpen,
    onClose: () => setIsOpen(false),
    inline,
    estimatedHeight: ESTIMATED_POPOVER_HEIGHT,
    repositionKey: `${viewMode}-${yearPage}`,
  });

  const YEARS_PER_PAGE = 25;
  const maxYear = effectiveMax ? effectiveMax.getFullYear() : today.getFullYear() + 50;
  const startYear = maxYear - 100 + yearPage * YEARS_PER_PAGE;
  const years: number[] = [];
  for (let y = startYear; y < startYear + YEARS_PER_PAGE && y <= maxYear; y++) {
    years.push(y);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function canGoNext(): boolean {
    if (!effectiveMax) return true;
    if (viewYear < effectiveMax.getFullYear()) return true;
    if (viewYear === effectiveMax.getFullYear() && viewMonth < effectiveMax.getMonth()) return true;
    return false;
  }

  function handleSelectDate(day: number) {
    const selected = new Date(viewYear, viewMonth, day);
    if (effectiveMax && selected > effectiveMax) return;
    if (effectiveMin && selected < effectiveMin) return;
    onChange(toISO(selected));
    setIsOpen(false);
  }

  function handleSelectMonth(month: number) {
    setViewMonth(month);
    setViewMode("days");
  }

  function handleSelectYear(year: number) {
    setViewYear(year);
    setViewMode("months");
    const page = Math.floor((year - (maxYear - 100)) / YEARS_PER_PAGE);
    setYearPage(Math.max(0, page));
  }

  function handleToggle() {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setViewMode("days");
    setYearPage(0);
    const d = toDate(value) ?? today;
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setIsOpen(true);
  }

  const days = daysInMonth(viewYear, viewMonth);
  const firstDay = firstDayOfMonth(viewYear, viewMonth);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= days; d++) calendarDays.push(d);

  const selectedDate = toDate(value);

  return (
    <div ref={containerRef} className={inline ? undefined : "relative w-full"}>
      <button
        id={id}
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(
          "flex h-11 w-full items-center rounded-xl border bg-surface px-3.5 text-base text-foreground outline-none transition-colors",
          isOpen
            ? "border-primary"
            : invalid
              ? "border-danger"
              : "border-border hover:border-muted-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "",
        )}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      <Popover
        open={isOpen}
        inline={inline}
        popoverRef={popoverRef}
        style={style}
        className={inline ? "mt-1 p-3" : "p-3"}
      >
        {viewMode === "days" && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button type="button" onClick={prevMonth} className={NAV_BUTTON_CLASSES}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("months")}
                className="rounded-md px-3 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {MONTHS[viewMonth]} {viewYear}
              </button>
              <button
                type="button"
                onClick={nextMonth}
                disabled={!canGoNext()}
                className={NAV_BUTTON_CLASSES}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-0.5">
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;

                const date = new Date(viewYear, viewMonth, day);
                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                const isPastOrPresent =
                  (!effectiveMax || date <= effectiveMax) && (!effectiveMin || date >= effectiveMin);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => isPastOrPresent && handleSelectDate(day)}
                    disabled={!isPastOrPresent}
                    className={cn(
                      CELL_BASE_CLASSES,
                      "flex h-8 w-full items-center justify-center",
                      isSelected
                        ? "bg-primary font-semibold text-primary-foreground"
                        : isPastOrPresent
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground/40",
                      isToday(date) && !isSelected ? "font-semibold" : "",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className={NAV_BUTTON_CLASSES}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("years")}
                className="rounded-md px-3 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {viewYear}
              </button>
              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                disabled={effectiveMax ? viewYear >= effectiveMax.getFullYear() : false}
                className={NAV_BUTTON_CLASSES}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((month, i) => {
                const beforeMax =
                  !effectiveMax ||
                  viewYear < effectiveMax.getFullYear() ||
                  (viewYear === effectiveMax.getFullYear() && i <= effectiveMax.getMonth());
                const afterMin =
                  !effectiveMin ||
                  viewYear > effectiveMin.getFullYear() ||
                  (viewYear === effectiveMin.getFullYear() && i >= effectiveMin.getMonth());
                const isPastOrPresent = beforeMax && afterMin;

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => isPastOrPresent && handleSelectMonth(i)}
                    disabled={!isPastOrPresent}
                    className={cn(
                      CELL_BASE_CLASSES,
                      "px-2 py-2",
                      viewMonth === i
                        ? "bg-primary font-semibold text-primary-foreground"
                        : isPastOrPresent
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground/40",
                    )}
                  >
                    {month.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "years" && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setYearPage((p) => Math.max(0, p - 1))}
                disabled={yearPage === 0}
                className={NAV_BUTTON_CLASSES}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-foreground">
                {startYear}–{startYear + YEARS_PER_PAGE - 1}
              </span>
              <button
                type="button"
                onClick={() => setYearPage((p) => p + 1)}
                disabled={
                  effectiveMax ? startYear + YEARS_PER_PAGE > effectiveMax.getFullYear() : false
                }
                className={NAV_BUTTON_CLASSES}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {years.map((y) => {
                const isPastOrPresent =
                  (!effectiveMax || y <= effectiveMax.getFullYear()) &&
                  (!effectiveMin || y >= effectiveMin.getFullYear());
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => isPastOrPresent && handleSelectYear(y)}
                    disabled={!isPastOrPresent}
                    className={cn(
                      CELL_BASE_CLASSES,
                      "px-2 py-1.5",
                      viewYear === y
                        ? "bg-primary font-semibold text-primary-foreground"
                        : isPastOrPresent
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground/40",
                    )}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            disabled={!value}
            className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => {
              const todayStr = toISO(today);
              onChange(todayStr);
              setViewMonth(today.getMonth());
              setViewYear(today.getFullYear());
              setIsOpen(false);
            }}
            className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Hoy
          </button>
        </div>
      </Popover>
    </div>
  );
}
