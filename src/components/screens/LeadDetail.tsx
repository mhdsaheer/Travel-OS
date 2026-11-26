import { canEdit } from '@/lib/portals';
import { usePortal as usePermissionIdentity } from '@/lib/portal-context';
import { PortalLink as Link, usePortalNavigate as useNavigate, usePortal } from "@/lib/portal-context";
import { useParams } from "@tanstack/react-router";
import { ArrowLeft, Copy, MessageCircle, Phone, Plane, Send, StickyNote, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { JourneyPath } from "@/components/app/JourneyPath";
import { Chunky, Confetti, StatusBadge, Tag, WhatsAppButton, leadStatuses, serviceMeta, statusLabel, useCelebrate } from "@/components/app/ui";
import { agency, agents } from "@/lib/mock-data";
import { formatMoney, shortDate, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";


const stageOf: Record<LeadStatus, number> = { new: 0, contacted: 1, fare_shared: 2, quote_sent: 2, confirmed: 3, lost: 0 };
const nextOf: Partial<Record<LeadStatus, { label: string; to: LeadStatus }>> = {
  new: { label: "Mark contacted", to: "contacted" }, contacted: { label: "Share fare", to: "fare_shared" },
  fare_shared: { label: "Confirm", to: "confirmed" }, quote_sent: { label: "Confirm", to: "confirmed" },
};

export function LeadDetail() {
  const editable = canEdit(usePermissionIdentity().role, 'enquiries');
  const { id } = useParams({ strict: false });
  const { leads, setLeadStatus, addNote, sendWhatsApp, setFollowUp, convertToTrip } = useStore();
  const navigate = useNavigate();
  const cel = useCelebrate();
  const [note, setNote] = useState("");
  const [fare, setFare] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="p-8 text-center">
        <p className="font-semibold">This enquiry doesn't exist.</p>
        <Link to="/enquiries" className="mt-4 inline-block font-semibold text-primary">Back to enquiries</Link>
      </div>
    );
  }
  const S = serviceMeta[lead.service];
  const next = editable ? nextOf[lead.status] : undefined;
  const lastIn = lead.activity.find((a) => a.kind === "wa_in");
  const suggestion = `Hi ${lead.name.split(" ")[0]}! Great news — I have ${lead.destination} options for ${lead.pax} pax. Shall I share the best fare?`;

  const advance = () => { if (!next) return; if (next.to === "fare_shared") setShareOpen(true); else { setLeadStatus(lead.id, next.to); if (next.to === "confirmed") cel.fire(); toast.success(`${statusLabel(next.to)}! Nice one`); } };
  const followUp = (days: number) => {
    const d = new Date(); d.setDate(d.getDate() + days); d.setHours(9, 0, 0, 0);
    if (d.getDay() === 5) d.setDate(d.getDate() + 1);
    setFollowUp(lead.id, d.toISOString()); toast.success(`Follow-up set for ${shortDate(d.toISOString())}, 9am`);
  };
  const sendFare = () => {
    const amt = Number(fare); if (!amt) return;
    sendWhatsApp(lead.id, `Fare for ${lead.destination}: ${formatMoney(amt, agency.currency)} for ${lead.pax} pax. Valid 24h.`);
    setLeadStatus(lead.id, "fare_shared"); setShareOpen(false); setFare(""); toast.success("Fare shared on WhatsApp");
  };

  return (
    <div className="mod-enquiries">
      <Confetti show={cel.show} />
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/enquiries" aria-label="Back"><ArrowLeft className="h-6 w-6 rtl:rotate-180" /></Link>
        <div className="min-w-0 flex-1"><p className="truncate font-display text-lg font-semibold">{lead.name}</p>
          <div className="flex gap-1">{lead.vip && <Tag kind="vip" />}{(lead.service === "umrah" || lead.service === "hajj") && <Tag kind={lead.service} />}</div></div>
        <label className="relative">
          <StatusBadge status={lead.status} />
          <select disabled={!editable} aria-label="Change status" value={lead.status} onChange={(e) => setLeadStatus(lead.id, e.target.value as LeadStatus)} className="absolute inset-0 cursor-pointer opacity-0">
            {leadStatuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
        </label>
      </header>

      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <JourneyPath current={stageOf[lead.status]} onAdvance={next ? advance : undefined} nextLabel={next?.label} />
        </div>
        <fieldset disabled={!editable} className="min-w-0 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <WhatsAppButton size="md" label="Chat" onClick={() => sendWhatsApp(lead.id, suggestion)} />
            <Chunky variant="outline" onClick={() => toast("Calling " + lead.phone)}><Phone className="h-4 w-4" /></Chunky>
            <Chunky variant="module" onClick={() => setShareOpen(true)}><Send className="h-4 w-4" /></Chunky>
            <Chunky onClick={() => { const t = convertToTrip(lead.id, 12000 * lead.pax); cel.fire(); toast.success("Trip created!"); if (t) setTimeout(() => navigate({ to: "/trips" }), 900); }}>
              <ArrowRightLeft className="h-4 w-4" />
            </Chunky>
          </div>
          <p className="-mt-2 grid grid-cols-4 text-center text-[11px] font-semibold text-muted-foreground"><span>WhatsApp</span><span>Call</span><span>Share fare</span><span>To trip</span></p>

          {shareOpen && (
            <div className="card-chunky space-y-3 p-4">
              <h3 className="font-semibold">Share fare</h3>
              <input autoFocus inputMode="numeric" value={fare} onChange={(e) => setFare(e.target.value)} placeholder={`Amount (${agency.currency})`} className="h-12 w-full rounded-xl border border-input px-4 font-semibold outline-none focus:border-primary" />
              <div className="rounded-xl bg-success-soft p-3 text-sm font-medium">Fare for {lead.destination}: {formatMoney(Number(fare) || 0, agency.currency)} for {lead.pax} pax. Valid 24h.</div>
              <Chunky variant="whatsapp" block onClick={sendFare} disabled={!Number(fare)}><MessageCircle className="h-4 w-4" /> Send on WhatsApp</Chunky>
            </div>
          )}

          {lastIn && (
            <div className="card-chunky p-4">
              <p className="text-xs font-semibold text-muted-foreground">AI suggested reply</p>
              <p className="mt-1 text-sm font-medium">{suggestion}</p>
              <WhatsAppButton label="Send reply" onClick={() => { sendWhatsApp(lead.id, suggestion); toast.success("Reply sent"); }} />
            </div>
          )}

          <div className="card-chunky grid grid-cols-2 gap-3 p-4 text-sm">
            <button className="col-span-2 flex items-center gap-2 text-start font-semibold" onClick={() => { navigator.clipboard?.writeText(lead.phone); toast("Phone copied"); }}><Copy className="h-4 w-4" />{lead.phone}</button>
            <Info k="Service" v={<span className="inline-flex items-center gap-1"><S.icon className="h-4 w-4" />{S.label}</span>} />
            <Info k="Destination" v={lead.destination} />
            <Info k="Travel" v={shortDate(lead.travelDate)} />
            <Info k="Pax" v={lead.pax} />
            <Info k="Source" v={lead.source} />
            <Info k="Priority" v={<span className="capitalize">{lead.priority}</span>} />
            <Info k="Agent" v={agents.find((a) => a.id === lead.agentId)?.name} />
            <Info k="AI score" v={<span><b className="text-primary">{lead.score}/10</b> · {lead.scoreReason}</span>} />
          </div>

          <div className="card-chunky p-4">
            <p className="font-semibold">Follow up {lead.followUp && <span className="text-sm text-muted-foreground">· set for {shortDate(lead.followUp)}</span>}</p>
            <div className="mt-2 flex gap-2">
              {[["Today", 0], ["Tomorrow", 1], ["3 days", 3]].map(([l, d]) => (
                <button key={l} onClick={() => followUp(d as number)} className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold hover:bg-secondary">{l}</button>
              ))}
            </div>
          </div>

          <Chunky variant="outline" block onClick={() => toast("Flight search is coming in the next round")}><Plane className="h-4 w-4" /> Search flights</Chunky>

          <div className="card-chunky p-4">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (note.trim()) { addNote(lead.id, note.trim()); setNote(""); } }}>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Quick note…" className="h-11 flex-1 rounded-xl border border-input px-3 font-medium outline-none focus:border-primary" />
              <Chunky size="sm" type="submit"><StickyNote className="h-4 w-4" /></Chunky>
            </form>
            <ol className="mt-4 space-y-3">
              {lead.activity.map((a) => (
                <li key={a.id} className={cn("max-w-[85%] rounded-xl px-3 py-2 text-sm font-medium",
                  a.kind === "wa_out" ? "ms-auto bg-success-soft" : a.kind === "wa_in" ? "bg-secondary" : a.kind === "note" ? "bg-warning-soft" : "mx-auto bg-transparent text-center text-xs text-muted-foreground")}>
                  {a.text}<span className="block text-[10px] font-semibold text-muted-foreground">{timeAgo(a.at)}</span>
                </li>
              ))}
            </ol>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: React.ReactNode }) {
  return <div><p className="text-xs font-semibold text-muted-foreground">{k}</p><div className="font-semibold">{v}</div></div>;
}
