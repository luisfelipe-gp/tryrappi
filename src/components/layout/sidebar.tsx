"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/fuentes", label: "Fuentes" },
  { href: "/estructuras", label: "Estructuras" }
];

export function Sidebar() {
  const pathname = usePathname();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="flex w-full flex-col border-b bg-white p-4 md:w-64 md:border-b-0 md:border-r">
      <div className="mb-4 text-lg font-bold text-primary">RappiBots Config</div>
      <nav className="flex gap-2 md:flex-col">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={cn("rounded-md px-3 py-2 text-sm", pathname === link.href ? "bg-primary text-white" : "hover:bg-slate-100")}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" className="mt-4 md:mt-auto" onClick={logout}>
        Cerrar sesión
      </Button>
    </aside>
  );
}
