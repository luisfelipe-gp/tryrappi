"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FuenteTipo } from "@/lib/types";

export function FuentesView() {
  const supabase = createClient();
  const { negocio, fuentes, setFuentes } = useAppStore();
  const [sheetId, setSheetId] = useState("");
  const [tab, setTab] = useState("Hoja1");

  const files = useMemo(
    () => ({
      excels: fuentes.filter((f) => f.tipo === "excel"),
      pdfs: fuentes.filter((f) => f.tipo === "pdf")
    }),
    [fuentes]
  );

  const upload = async (file: File, tipo: FuenteTipo) => {
    if (!negocio) return;
    const ext = file.name.split(".").pop();
    const filePath = `${negocio.id}/${crypto.randomUUID()}.${ext}`;
    await supabase.storage.from("negocios").upload(filePath, file);
    const { data } = supabase.storage.from("negocios").getPublicUrl(filePath);

    await supabase.from("fuentes").insert({
      negocio_id: negocio.id,
      nombre: file.name,
      tipo,
      url: data.publicUrl
    });

    location.reload();
  };

  const addSheets = async () => {
    if (!negocio || !sheetId) return;
    await supabase.from("fuentes").insert({
      negocio_id: negocio.id,
      nombre: `Sheet ${sheetId}`,
      tipo: "sheets",
      url: `https://docs.google.com/spreadsheets/d/${sheetId}`,
      sheets_id: sheetId,
      pestaña: tab
    });
    location.reload();
  };

  const removeFuente = async (id: string) => {
    await supabase.from("fuentes").delete().eq("id", id);
    setFuentes(fuentes.filter((f) => f.id !== id));
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Fuentes de Datos</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Subir Excel/CSV</CardTitle></CardHeader>
          <CardContent><Input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "excel")} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Subir PDF</CardTitle></CardHeader>
          <CardContent><Input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "pdf")} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Conectar Google Sheets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="ID de la hoja" value={sheetId} onChange={(e) => setSheetId(e.target.value)} />
            <Input placeholder="Pestaña" value={tab} onChange={(e) => setTab(e.target.value)} />
            <Button className="w-full" onClick={addSheets}>Guardar</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fuentes.map((fuente) => (
          <Card key={fuente.id}>
            <CardHeader><CardTitle>{fuente.nombre}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Tipo:</strong> {fuente.tipo}</p>
              <p><strong>Fecha:</strong> {new Date(fuente.created_at).toLocaleString()}</p>
              <Button variant="outline" onClick={() => removeFuente(fuente.id)}>Eliminar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-slate-500">Excel disponibles: {files.excels.length} · PDFs: {files.pdfs.length}</p>
    </section>
  );
}
