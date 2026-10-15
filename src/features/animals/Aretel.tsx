import { cn } from "../../lib/utils";
import { digitsOnly, isCompleteAnimalCode } from "../../lib/animal-code";

type AretelSize = "sm" | "md" | "lg";

interface AretelProps {
  codigo: string;
  size?: AretelSize;
  className?: string;
}

interface SizeConfig {
  container: string;
  peg: string;
  hole: string;
  head: string;
  tail: string;
}

const SIZES: Record<AretelSize, SizeConfig> = {
  sm: {
    container: "h-12 min-w-[68px] rounded-[18px] px-3 pt-2",
    peg: "-top-1.5 h-2.5 w-2.5 rounded-t-md",
    hole: "top-1 h-1.5 w-1.5",
    head: "text-[9px]",
    tail: "text-base",
  },
  md: {
    container: "h-[70px] min-w-[96px] rounded-[18px] px-4 pt-3",
    peg: "-top-2 h-3.5 w-3.5 rounded-t-md",
    hole: "top-1.5 h-2 w-2",
    head: "text-[11px]",
    tail: "text-2xl",
  },
  lg: {
    container: "h-28 min-w-[190px] rounded-[24px] px-6 pt-4",
    peg: "-top-3 h-5 w-5 rounded-t-lg",
    hole: "top-2.5 h-3 w-3",
    head: "text-xl",
    tail: "text-5xl",
  },
};

/**
 * Representación visual del código como un arete (etiqueta de oreja) amarillo.
 * Con el formato 2-3-4 los primeros 5 números se muestran pequeños y los
 * últimos 4 más grandes.
 */
export function Aretel({ codigo, size = "md", className }: AretelProps) {
  const config = SIZES[size];
  const isComplete = isCompleteAnimalCode(codigo);
  const digits = digitsOnly(codigo);

  const head = isComplete ? `${digits.slice(0, 2)}-${digits.slice(2, 5)}` : codigo;
  const tail = isComplete ? digits.slice(5) : "";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 flex-col items-center justify-center border-2 border-tag-foreground/85 bg-tag shadow-[0_3px_0_rgba(0,0,0,0.18)]",
        config.container,
        className,
      )}
    >
      {/* Pernotillo superior del arete */}
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 border-2 border-b-0 border-tag-foreground/85 bg-tag",
          config.peg,
        )}
      />
      {/* Perforación */}
      <span
        className={cn(
          "absolute rounded-full border-2 border-tag-foreground/70 bg-white/80",
          config.hole,
        )}
      />

      <span
        className={cn(
          "max-w-[10rem] truncate font-semibold leading-none tracking-wider text-tag-foreground/60",
          config.head,
        )}
      >
        {head}
      </span>

      {tail && (
        <span
          className={cn(
            "mt-0.5 font-extrabold leading-none tracking-wide text-tag-foreground",
            config.tail,
          )}
        >
          {tail}
        </span>
      )}
    </div>
  );
}
