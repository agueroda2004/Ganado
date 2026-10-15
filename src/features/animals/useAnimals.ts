import { useCallback, useState } from "react";
import type { Animal, AnimalInput } from "../../domain/animal";
import {
  createAnimal,
  deleteAnimal,
  loadAnimals,
  saveAnimals,
  updateAnimal,
} from "../../storage/animals-storage";

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>(() => loadAnimals());

  const add = useCallback((input: AnimalInput) => {
    setAnimals((current) => createAnimal(current, input));
  }, []);

  const edit = useCallback((id: string, input: AnimalInput) => {
    setAnimals((current) => updateAnimal(current, id, input));
  }, []);

  const remove = useCallback((id: string) => {
    setAnimals((current) => deleteAnimal(current, id));
  }, []);

  const replaceAll = useCallback((next: Animal[]) => {
    saveAnimals(next);
    setAnimals(next);
  }, []);

  return { animals, add, edit, remove, replaceAll };
}
