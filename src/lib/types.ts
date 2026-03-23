export type FuenteTipo = "excel" | "pdf" | "sheets";

export interface Negocio {
  id: string;
  user_id: string;
  nombre: string | null;
  created_at: string;
}

export interface Fuente {
  id: string;
  negocio_id: string;
  nombre: string;
  tipo: FuenteTipo;
  url: string;
  sheets_id: string | null;
  pestaña: string | null;
  created_at: string;
}

export interface Estructura {
  id: string;
  negocio_id: string;
  nombre: string;
  fuente_excel_id: string;
  fuente_pdf_id: string | null;
  prompt_personalizado: string;
  activa: boolean;
  created_at: string;
}
