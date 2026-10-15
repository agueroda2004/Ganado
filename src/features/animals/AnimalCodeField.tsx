import { useRef } from "react";
import { TextField } from "../../components/ui/TextField";
import {
  caretAfterDigits,
  countDigits,
  formatAnimalCode,
} from "../../lib/animal-code";

interface AnimalCodeFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

/**
 * Campo de código que solo acepta números y aplica el formato 2-3-4
 * mientras se escribe o se pega, conservando la posición del cursor.
 */
export function AnimalCodeField({ id, value, onChange, invalid }: AnimalCodeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(raw: string) {
    const element = inputRef.current;
    const caret = element?.selectionStart ?? raw.length;
    const digitsBeforeCaret = countDigits(raw.slice(0, caret));
    const formatted = formatAnimalCode(raw);

    onChange(formatted);

    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) return;
      const position = caretAfterDigits(formatted, digitsBeforeCaret);
      node.setSelectionRange(position, position);
    });
  }

  return (
    <TextField
      id={id}
      inputRef={inputRef}
      value={value}
      onChange={handleChange}
      placeholder="12-345-6789"
      inputMode="numeric"
      invalid={invalid}
    />
  );
}
