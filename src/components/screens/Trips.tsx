import { useState } from "react";
import { ModuleHeader, Tag } from "@/components/app/ui";
import { agency } from "@/lib/mock-data";
import { formatMoney, shortDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";


const tabs = ["All", "Upcoming", "Today", "Completed"] as const;

export function Trips() {
  const { trips } = useStore();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const today = new Date().toDateString();
  const list = trips.filter((t) => tab === "All" || (tab === "Today" ? new Date(t.start).toDateString() === today
    : tab === "Upcoming" ? new Date(t.start) > new Date() : t.status === "travelled"));

  return (
    <div className="mod-trips">
      <ModuleHeader title="Trips" subtitle={`${trips.filter((t) => t.status !== "travelled").length} active trips`} />
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex gap-2 rounded-xl bg-secondary p-1">
          {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={cn("flex-1 rounded-xl py-2 text-sm font-semibold", tab === t ? "bg-card text-mod shadow-sm" : "text-muted-foreground")}>{t}</button>)}
        </div>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {list.map((t) => {
            const pct = Math.round((t.paid / t.total) * 100);
            return (
              <li key={t.id} className="card-chunky overflow-hidden">
                <div className={cn("h-2", t.status === "travelled" ? "bg-muted-foreground" : t.paid >= t.total ? "bg-success" : "bg-mod")} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="font-display text-lg font-semibold">{t.flag} {t.destination}</p><p className="text-sm font-medium text-muted-foreground">{t.customer} · {t.pax} pax</p></div>
                    {(t.service === "umrah" || t.service === "hajj") && <Tag kind={t.service} />}
                  </div>
                  <p className="mt-2 text-sm font-semibold">{shortDate(t.start)} → {shortDate(t.end)} · <span className="capitalize">{t.status}</span></p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">{formatMoney(t.paid, agency.currency)} of {formatMoney(t.total, agency.currency)} paid</p>
                </div>
              </li>
            );
          })}
          {list.length === 0 && <li className="card-chunky p-8 text-center font-semibold md:col-span-2">No trips here yet.</li>}
        </ul>
      </div>
    </div>
  );
}
