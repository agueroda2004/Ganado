import { Download, LogOut, Upload } from "lucide-react";
import logo from "../../assets/logo.svg";

interface AppHeaderProps {
  onExport: () => void;
  onImport: () => void;
  onLogout: () => void;
}

const ICON_BUTTON =
  "flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function AppHeader({ onExport, onImport, onLogout }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
            <img src={logo} alt="Logo" className="h-7 w-7 invert" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-foreground">
              Ganado
            </h1>
            <p className="truncate text-xs text-muted-foreground">Gestión de animales</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onExport} aria-label="Exportar" className={ICON_BUTTON}>
            <Download className="h-5 w-5" />
          </button>
          <button type="button" onClick={onImport} aria-label="Importar" className={ICON_BUTTON}>
            <Upload className="h-5 w-5" />
          </button>
          <button type="button" onClick={onLogout} aria-label="Cerrar sesión" className={ICON_BUTTON}>
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
