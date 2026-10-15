import { useMemo } from "react";
import { Beef } from "lucide-react";
import type { Animal } from "../../domain/animal";
import { FINCAS } from "../../domain/animal";

interface StatsPanelProps {
  animals: Animal[];
}

export function StatsPanel({ animals }: StatsPanelProps) {
  const stats = useMemo(() => {
    const total = animals.length;
    const medias = animals.filter((animal) => animal.estado === "Medias").length;
    const propio = total - medias;
    const byFinca = FINCAS.map((finca) => ({
      finca,
      count: animals.filter((animal) => animal.finca === finca).length,
    }));
    return { total, medias, propio, byFinca };
  }, [animals]);

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex items-center gap-4 rounded-2xl bg-primary p-4 text-primary-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Beef className="h-6 w-6" />
          </div>
          <div>
            <p className="text-3xl font-bold leading-none">{stats.total}</p>
            <p className="text-sm opacity-70">
              {stats.total === 1 ? "animal en total" : "animales en total"}
            </p>
          </div>
        </div>

        <StatTile label="Propio" value={stats.propio} accent="success" />
        <StatTile label="Medias" value={stats.medias} accent="info" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.byFinca.map((item) => (
          <div
            key={item.finca}
            className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.finca}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{item.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface StatTileProps {
  label: string;
  value: number;
  accent: "success" | "info";
}

function StatTile({ label, value, accent }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={
            accent === "success"
              ? "h-2.5 w-2.5 rounded-full bg-success"
              : "h-2.5 w-2.5 rounded-full bg-info"
          }
        />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
