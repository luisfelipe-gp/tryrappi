"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  nombre: string;
  fuente_excel_id: string;
  fuente_pdf_id: string;
  prompt_personalizado: string;
  activa: boolean;
}

const initialForm: FormData = {
  nombre: "",
  fuente_excel_id: "",
  fuente_pdf_id: "",
  prompt_personalizado: "",
  activa: false
};

export function EstructurasView() {
  const supabase = createClient();
  const { negocio, fuentes, estructuras } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);

  const excelFuentes = useMemo(() => fuentes.filter((f) => f.tipo === "excel"), [fuentes]);
  const pdfFuentes = useMemo(() => fuentes.filter((f) => f.tipo === "pdf"), [fuentes]);

  const save = async () => {
    if (!negocio) return;

    if (form.activa) {
      await supabase.from("estructuras").update({ activa: false }).eq("negocio_id", negocio.id);
    }

    await supabase.from("estructuras").insert({
      negocio_id: negocio.id,
      nombre: form.nombre,
      fuente_excel_id: form.fuente_excel_id,
      fuente_pdf_id: form.fuente_pdf_id || null,
      prompt_personalizado: form.prompt_personalizado,
      activa: form.activa
    });

    setOpen(false);
    setForm(initialForm);
    location.reload();
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Estructuras del Bot</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Crear nueva estructura</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="mb-4 text-lg font-semibold">Nueva estructura</DialogTitle>
            <div className="space-y-3">
              <Input placeholder="Nombre de la estructura" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />

              <Select value={form.fuente_excel_id} onValueChange={(value) => setForm({ ...form, fuente_excel_id: value })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar Excel" /></SelectTrigger>
                <SelectContent>{excelFuentes.map((f) => <SelectItem key={f.id} value={f.id}>{f.nombre}</SelectItem>)}</SelectContent>
              </Select>

              <Select value={form.fuente_pdf_id} onValueChange={(value) => setForm({ ...form, fuente_pdf_id: value })}>
                <SelectTrigger><SelectValue placeholder="PDF opcional" /></SelectTrigger>
                <SelectContent>{pdfFuentes.map((f) => <SelectItem key={f.id} value={f.id}>{f.nombre}</SelectItem>)}</SelectContent>
              </Select>

              <Textarea placeholder="Prompt personalizado" value={form.prompt_personalizado} onChange={(e) => setForm({ ...form, prompt_personalizado: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} />
                Activar esta estructura
              </label>
              <Button className="w-full" onClick={save}>Guardar estructura</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
        </TabsList>
        <TabsContent value="lista">
          <Card>
            <CardHeader><CardTitle>Estructuras guardadas</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Activa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estructuras.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                      <TableCell>{item.activa ? "Sí" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resumen">
          <Card>
            <CardContent className="pt-4 text-sm text-slate-600">Total estructuras: {estructuras.length}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
