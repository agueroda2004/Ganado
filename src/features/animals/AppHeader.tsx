import { Download, LogOut, Upload } from "lucide-react";
import logo from "../../assets/logo.svg";

interface AppHeaderProps {
  onExport: () => void;
  onImport: () => void;
  onLogout: () => void;
}

const ICON_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function AppHeader({ onExport, onImport, onLogout }: AppHeaderProps) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-3xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary">
            <img src={logo} alt="Logo" className="h-8 w-8 invert" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight text-foreground">
              Ganado
            </h1>
            <p className="truncate text-sm text-muted-foreground">Gestión de animales</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onExport} aria-label="Exportar" className={ICON_BUTTON}>
            <Download className="h-6 w-6" />
          </button>
          <button type="button" onClick={onImport} aria-label="Importar" className={ICON_BUTTON}>
            <Upload className="h-6 w-6" />
          </button>
          <button type="button" onClick={onLogout} aria-label="Cerrar sesión" className={ICON_BUTTON}>
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
