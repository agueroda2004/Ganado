import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import logo from "../../assets/logo.svg";
import { verifyCode } from "./auth-storage";

interface LoginScreenProps {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Escribe la clave de acceso.");
      return;
    }
    if (!verifyCode(code)) {
      setError("La clave no es correcta.");
      return;
    }
    onSuccess();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-lg">
            <img src={logo} alt="Logo" className="h-12 w-12 invert" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Ganado</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa la clave para continuar
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={code}
              autoFocus
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              placeholder="Clave de acceso"
              className={
                "h-12 w-full rounded-xl border bg-surface pl-10 pr-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground " +
                (error ? "border-danger" : "border-border focus:border-primary")
              }
            />
          </div>

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <Button type="submit" className="h-12 w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
