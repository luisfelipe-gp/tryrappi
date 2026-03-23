"use client";

import { create } from "zustand";
import type { Estructura, Fuente, Negocio } from "@/lib/types";

interface AppState {
  negocio: Negocio | null;
  fuentes: Fuente[];
  estructuras: Estructura[];
  setNegocio: (negocio: Negocio | null) => void;
  setFuentes: (fuentes: Fuente[]) => void;
  setEstructuras: (estructuras: Estructura[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  negocio: null,
  fuentes: [],
  estructuras: [],
  setNegocio: (negocio) => set({ negocio }),
  setFuentes: (fuentes) => set({ fuentes }),
  setEstructuras: (estructuras) => set({ estructuras })
}));
