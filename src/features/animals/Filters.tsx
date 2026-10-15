import { Search, X } from "lucide-react";
import { Dropdown, type DropdownOption } from "../../components/ui/Dropdown";
import { FINCAS } from "../../domain/animal";
import { filterDigits } from "../../lib/animal-code";

export interface AnimalFilters {
  codigo: string;
  socio: string;
  finca: string;
}

export const EMPTY_FILTERS: AnimalFilters = { codigo: "", socio: "", finca: "" };

interface FiltersProps {
  filters: AnimalFilters;
  socioOptions: string[];
  onChange: (filters: AnimalFilters) => void;
}

export function Filters({ filters, socioOptions, onChange }: FiltersProps) {
  const socioDropdownOptions: DropdownOption[] = socioOptions.map((value) => ({
    value,
    label: value,
  }));
  const fincaDropdownOptions: DropdownOption[] = FINCAS.map((value) => ({
    value,
    label: value,
  }));

  const hasFilters = Boolean(filters.codigo || filters.socio || filters.finca);

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            inputMode="numeric"
            value={filters.codigo}
            onChange={(event) =>
              onChange({ ...filters, codigo: filterDigits(event.target.value) })
            }
            placeholder="Últimos 4 dígitos del código"
            className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Dropdown
            value={filters.socio}
            onChange={(value) => onChange({ ...filters, socio: value })}
            options={socioDropdownOptions}
            placeholder="Socio"
            allowClear
            clearLabel="Todos los socios"
          />
          <Dropdown
            value={filters.finca}
            onChange={(value) => onChange({ ...filters, finca: value })}
            options={fincaDropdownOptions}
            placeholder="Finca"
            allowClear
            clearLabel="Todas las fincas"
          />
        </div>
      </div>
    </section>
  );
}
