import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export interface ToastMessage {
  id: number;
  text: string;
  tone: "info" | "success" | "danger";
}

interface ToastProps {
  message: ToastMessage | null;
  onDismiss: () => void;
}

const TONES: Record<ToastMessage["tone"], string> = {
  info: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  danger: "bg-danger text-danger-foreground",
};

export function Toast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const onDismissRef = useRef(onDismiss);
  const messageId = message?.id ?? null;

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (messageId === null) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDismissRef.current();
    }, 3200);
    return () => clearTimeout(timer);
  }, [messageId]);

  if (!message || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4">
      <div
        className={cn(
          "animate-fade-in max-w-sm rounded-full px-4 py-2.5 text-sm font-medium shadow-lg",
          TONES[message.tone],
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
