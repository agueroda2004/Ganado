import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import { Z_INDEX } from "./z-index";

const POPOVER_GAP = 4;
const ESTIMATED_POPOVER_HEIGHT = 320;

type PopoverPlacement = "top" | "bottom";

interface PopoverCoordinates {
  top: number;
  left: number;
  width: number;
  placement: PopoverPlacement;
}

function computeCoordinates(
  trigger: HTMLElement | null,
  height: number,
): PopoverCoordinates | null {
  if (!trigger) return null;
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const placement: PopoverPlacement =
    spaceBelow < height + POPOVER_GAP && spaceAbove > spaceBelow ? "top" : "bottom";
  const top =
    placement === "bottom"
      ? rect.bottom + POPOVER_GAP
      : Math.max(POPOVER_GAP, rect.top - height - POPOVER_GAP);
  return { top, left: rect.left, width: rect.width, placement };
}

interface UseAnchoredPopoverOptions {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
  estimatedHeight?: number;
  repositionKey?: unknown;
}

interface UseAnchoredPopoverResult {
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  style: CSSProperties | undefined;
  /** "top" cuando el popover se abre hacia arriba por falta de espacio abajo. */
  placement: PopoverPlacement;
}

export function useAnchoredPopover({
  open,
  onClose,
  inline = false,
  estimatedHeight = ESTIMATED_POPOVER_HEIGHT,
  repositionKey,
}: UseAnchoredPopoverOptions): UseAnchoredPopoverResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<PopoverCoordinates | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      onCloseRef.current();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || inline) {
      return;
    }
    function update() {
      const height = popoverRef.current?.offsetHeight ?? estimatedHeight;
      setCoordinates(computeCoordinates(triggerRef.current, height));
    }
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, inline, estimatedHeight, repositionKey]);

  const style: CSSProperties | undefined = inline
    ? undefined
    : {
        position: "fixed",
        top: coordinates?.top ?? 0,
        left: coordinates?.left ?? 0,
        width: coordinates?.width ?? 0,
        zIndex: Z_INDEX.popover,
        visibility: coordinates ? "visible" : "hidden",
      };

  return { containerRef, triggerRef, popoverRef, style, placement: coordinates?.placement ?? "bottom" };
}
