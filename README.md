# Panel SaaS Bots WhatsApp

Aplicación en Next.js + TypeScript + Tailwind + shadcn/ui para gestionar fuentes de datos y estructuras de un bot de WhatsApp con logística automatizada.

## Setup

1. Copia `.env.example` a `.env.local` y completa claves de Supabase.
2. Ejecuta `npm install` y luego `npm run dev`.
3. Ejecuta `supabase/schema.sql` en tu proyecto Supabase.
4. Crea bucket público `negocios` en Supabase Storage.

## Funcionalidades

- Login con Google vía Supabase Auth.
- Vista **Fuentes de Datos**: subida de Excel/CSV/PDF y conexión Google Sheets.
- Vista **Estructuras del Bot**: CRUD básico de estructuras, con activación única.
- Layout con sidebar responsive.
- Estado global con Zustand.
