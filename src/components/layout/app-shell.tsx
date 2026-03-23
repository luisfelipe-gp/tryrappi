"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import type { Estructura, Fuente, Negocio } from "@/lib/types";
import { useAppStore } from "@/store/app-store";

interface AppShellProps {
  negocio: Negocio;
  fuentes: Fuente[];
  estructuras: Estructura[];
  children: React.ReactNode;
}

export function AppShell({ negocio, fuentes, estructuras, children }: AppShellProps) {
  const { setNegocio, setFuentes, setEstructuras } = useAppStore();

  useEffect(() => {
    setNegocio(negocio);
    setFuentes(fuentes);
    setEstructuras(estructuras);
  }, [negocio, fuentes, estructuras, setNegocio, setFuentes, setEstructuras]);

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
