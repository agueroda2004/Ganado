import { Button } from "./Button";
import { BottomSheet } from "./BottomSheet";

interface ConfirmSheetProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSheet({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onClose,
  onConfirm,
}: ConfirmSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="pb-2 text-sm text-muted-foreground">{description}</p>
    </BottomSheet>
  );
}
