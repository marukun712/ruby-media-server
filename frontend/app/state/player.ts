import { atom, useSetAtom } from "jotai";

export const playerTargetAtom = atom<{
  id: string;
  title: string;
  image: string;
} | null>(null);

export const useSetPlayerTarget = () => useSetAtom(playerTargetAtom);
