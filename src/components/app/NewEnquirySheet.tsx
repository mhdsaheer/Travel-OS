import { usePortalNavigate as useNavigate } from "@/lib/portal-context";
import { AlertTriangle, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Chunky, serviceMeta } from "./ui";
import { useStore } from "@/lib/store";
import type { Priority, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const destinations = ["Makkah", "Madinah", "Dubai", "London", "Istanbul", "Cairo", "Baku", "Kuala Lumpur", "Paris", "Jakarta", "Kochi", "Mumbai"];
const field = "h-12 w-full rounded-xl border border-input bg-card px-4 font-medium outline-none focus:border-primary";

export function NewEnquirySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addLead, leads, me } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+966 ");
  const [service, setService] = useState<Service>("flight");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10));
  const [pax, setPax] = useState(1);
  const [source, setSource] = useState("WhatsApp");
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");

  const existing = phone.replace(/\D/g, "").length > 8 ? leads.find((l) => l.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")) : undefined;
  const past = new Date(date) < new Date(new Date().toDateString());
  const canNext = step === 0 ? name.trim().length > 1 && phone.replace(/\D/g, "").length > 7 : step === 1 ? destination.trim().length > 1 : true;

  const reset = () => { setStep(0); setName(""); setPhone("+966 "); setDestination(""); setPax(1); setNotes(""); };
  const submit = () => {
    const lead = addLead({ name, phone, service, destination, travelDate: new Date(date).toISOString(), pax, source, priority, status: "new", agentId: me });
    if (notes) lead.activity.unshift({ id: lead.id + "n", kind: "note", text: notes, at: lead.createdAt });
    onOpenChange(false); reset();
    toast.success("Enquiry added!", { action: { label: "View enquiry", onClick: () => navigate({ to: "/enquiries/$id", params: { id: lead.id } }) } });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mod-enquiries mx-auto max-h-[92vh] max-w-lg">
        <DrawerTitle className="sr-only">New enquiry</DrawerTitle>
        <div className="flex items-center gap-3 px-5 pt-3">
          <button onClick={() => onOpenChange(false)} aria-label="Close" className="text-muted-foreground"><X /></button>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
        </div>
        <div className="overflow-y-auto px-5 py-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Who's asking?</h2>
              <input className={field} placeholder="Customer name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <input className={field} placeholder="Phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <p className="text-sm font-medium text-muted-foreground">✓ Same number on WhatsApp</p>
              {existing && (
                <button onClick={() => { onOpenChange(false); navigate({ to: "/enquiries/$id", params: { id: existing.id } }); }}
                  className="flex w-full items-center gap-2 rounded-xl bg-warning-soft p-3 text-start text-sm font-semibold text-warning">
                  <AlertTriangle className="h-4 w-4" /> Customer already in system: {existing.name} → open
                </button>
              )}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What do they need?</h2>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(serviceMeta) as Service[]).map((s) => {
                  const M = serviceMeta[s];
                  return (
                    <button key={s} onClick={() => setService(s)}
                      className={cn("chunky flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold",
                        service === s ? "border-mod bg-mod-soft [--chunky-lip:var(--mod)]" : "border-border bg-card")}>
                      <M.icon className="h-6 w-6" /> {M.label}
                    </button>
                  );
                })}
              </div>
              <input className={field} list="dest-list" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
              <datalist id="dest-list">{destinations.map((d) => <option key={d} value={d} />)}</datalist>
              <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
              {past && <p className="flex items-center gap-2 text-sm font-semibold text-warning"><AlertTriangle className="h-4 w-4" /> That date is in the past — double-check.</p>}
              <div className="flex items-center justify-between rounded-xl border border-input p-3">
                <span className="font-semibold">Travellers</span>
                <div className="flex items-center gap-3">
                  <Chunky variant="outline" size="icon" className="h-10 w-10" onClick={() => setPax(Math.max(1, pax - 1))} aria-label="Fewer"><Minus className="h-4 w-4" /></Chunky>
                  <span className="w-6 text-center text-xl font-semibold">{pax}</span>
                  <Chunky variant="outline" size="icon" className="h-10 w-10" onClick={() => setPax(pax + 1)} aria-label="More"><Plus className="h-4 w-4" /></Chunky>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Last details</h2>
              <div className="flex flex-wrap gap-2">
                {["WhatsApp", "Call", "Walk-in", "Instagram", "Referral"].map((s) => (
                  <button key={s} onClick={() => setSource(s)} className={cn("rounded-full border px-4 py-2 text-sm font-semibold", source === s ? "border-primary bg-accent" : "border-border")}>{s}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as Priority[]).map((p) => (
                  <button key={p} onClick={() => setPriority(p)} className={cn("flex-1 rounded-xl border py-3 text-sm font-semibold capitalize", priority === p ? "border-primary bg-accent" : "border-border")}>{p}</button>
                ))}
              </div>
              <textarea className={cn(field, "h-24 py-3")} placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <p className="text-sm font-medium text-muted-foreground">Assigned to: me</p>
            </div>
          )}
        </div>
        <div className="border-t border-border p-5">
          <Chunky block size="lg" disabled={!canNext} onClick={() => (step < 2 ? setStep(step + 1) : submit())}>
            {step < 2 ? "Continue" : "Add enquiry"}
          </Chunky>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
