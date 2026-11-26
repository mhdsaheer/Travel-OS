import { MessageCircle, Bell, Globe, Coins } from "lucide-react";
import { ModuleHeader } from "@/components/app/ui";
import { agency } from "@/lib/mock-data";


export function Settings() {
  const rows = [
    { icon: MessageCircle, k: "WhatsApp", v: "Connected · +966 50 123 4567" },
    { icon: Bell, k: "Payment reminders", v: "Auto-send 3 days before travel" },
    { icon: Globe, k: "Language", v: "English (Arabic coming next)" },
    { icon: Coins, k: "Agency currency", v: agency.currency },
  ];
  return (
    <div className="mod-settings">
      <ModuleHeader title="Automation & Settings" subtitle={agency.name} />
      <ul className="mx-auto max-w-3xl space-y-3 px-4 py-5">
        {rows.map((r) => (
          <li key={r.k} className="card-chunky flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mod-soft"><r.icon className="h-5 w-5 text-mod" /></span>
            <div><p className="font-semibold">{r.k}</p><p className="text-sm font-medium text-muted-foreground">{r.v}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
