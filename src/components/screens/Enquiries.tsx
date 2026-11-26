import { canEdit } from '@/lib/portals';
import { usePortal as usePermissionIdentity } from '@/lib/portal-context';
import { PortalLink as Link } from "@/lib/portal-context";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useShell } from "@/components/app/AppShell";
import { ModuleHeader, StatusBadge, Tag, WhatsAppButton, leadStatuses, serviceMeta, statusLabel, Chunky } from "@/components/app/ui";
import { initials, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";


export function Enquiries() {
  const editable = canEdit(usePermissionIdentity().role, 'enquiries');
  const { leads, role, me, sendWhatsApp } = useStore();
  const { openNewEnquiry } = useShell();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const scope = role === "agent" ? leads.filter((l) => l.agentId === me) : leads;
  const list = scope.filter((l) => (filter === "all" || l.status === filter) &&
    [l.name, l.phone, l.destination].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <ModuleHeader title="Enquiries" subtitle={`${scope.filter((l) => l.status === "new").length} new waiting for you`}
        action={<Chunky variant="outline" size="sm" className="hidden md:inline-flex" disabled={!editable} onClick={openNewEnquiry}><Plus className="h-4 w-4" /> New</Chunky>} />
      <div className="sticky top-0 z-20 space-y-3 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-5xl space-y-3">
          <label className="flex h-12 items-center gap-2 rounded-xl border border-input bg-card px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, destination" className="flex-1 bg-transparent font-medium outline-none" />
          </label>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {(["all", ...leadStatuses] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold", filter === s ? "border-mod bg-mod text-mod-ink" : "border-border bg-card")}>
                {s === "all" ? "All" : statusLabel(s)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ul className="mx-auto max-w-5xl space-y-3 px-4">
        {list.map((l) => {
          const S = serviceMeta[l.service];
          return (
            <li key={l.id}>
              <Link to="/enquiries/$id" params={{ id: l.id }} className="card-chunky flex items-center gap-3 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mod-soft font-semibold">{initials(l.name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5"><p className="truncate font-semibold">{l.name}</p>{l.vip && <Tag kind="vip" />}{(l.service === "umrah" || l.service === "hajj") && <Tag kind={l.service} />}</div>
                  <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><S.icon className="h-3.5 w-3.5" /> {l.destination} · {timeAgo(l.createdAt)}</p>
                  <div className="mt-1.5"><StatusBadge status={l.status} /></div>
                </div>
                <WhatsAppButton disabled={!editable} size="icon" onClick={() => sendWhatsApp(l.id, `Hi ${l.name.split(" ")[0]}, thanks for your ${l.destination} enquiry!`)} />
              </Link>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="card-chunky p-8 text-center">
            <p className="font-semibold">No enquiries match.</p>
            <Chunky className="mt-4" disabled={!editable} onClick={openNewEnquiry}><Plus className="h-4 w-4" /> New enquiry</Chunky>
          </li>
        )}
      </ul>
      <button disabled={!editable} onClick={openNewEnquiry} aria-label="New enquiry"
        className="chunky fixed bottom-24 end-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground [--chunky-lip:var(--primary-lip)] md:hidden">
        <Plus className="h-8 w-8" />
      </button>
    </div>
  );
}
