import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: negocio } = await supabase.from("negocios").select("*").eq("user_id", user.id).single();
  if (!negocio) {
    redirect("/login");
  }

  const { data: fuentes } = await supabase.from("fuentes").select("*").eq("negocio_id", negocio.id).order("created_at", { ascending: false });
  const { data: estructuras } = await supabase.from("estructuras").select("*").eq("negocio_id", negocio.id).order("created_at", { ascending: false });

  return (
    <AppShell negocio={negocio} fuentes={fuentes ?? []} estructuras={estructuras ?? []}>
      {children}
    </AppShell>
  );
}
