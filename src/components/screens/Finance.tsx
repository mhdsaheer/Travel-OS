import { canEdit } from '@/lib/portals';
import { usePortal as usePermissionIdentity } from '@/lib/portal-context';
import { CheckCircle2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Chunky, Confetti, CountUp, ModuleHeader, useCelebrate } from "@/components/app/ui";
import { agency } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";


export function Finance() {
  const editable = canEdit(usePermissionIdentity().role, 'finance');
  const { trips, payments, recordPayment } = useStore();
  const cel = useCelebrate();
  const [open, setOpen] = useState(false);
  const [tripId, setTripId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank transfer");
  const [done, setDone] = useState(false);
  const due = trips.filter((t) => t.paid < t.total);
  const outstanding = due.reduce((s, t) => s + t.total - t.paid, 0);
  const collected = payments.reduce((s, p) => s + p.amount, 0);
  const money = (n: number) => formatMoney(n, agency.currency);

  const start = (id?: string) => { const t = trips.find((x) => x.id === (id ?? due[0]?.id)); setTripId(t?.id ?? ""); setAmount(t ? String(t.total - t.paid) : ""); setDone(false); setOpen(true); };
  const save = () => {
    recordPayment(tripId, Number(amount), method); setDone(true); cel.fire(); toast.success("Payment recorded!");
    setTimeout(() => setOpen(false), 1400);
  };

  return (
    <div className="mod-finance">
      <Confetti show={cel.show} />
      <ModuleHeader title="Finance" subtitle={`${money(outstanding)} still to collect`}
        action={<Chunky disabled={!editable} variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => start()}><Wallet className="h-4 w-4" /> Record payment</Chunky>} />
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="card-chunky p-4"><p className="text-sm font-semibold text-muted-foreground">Collected</p><p className="font-display text-2xl font-semibold text-success"><CountUp value={collected} format={money} /></p></div>
          <div className="card-chunky p-4"><p className="text-sm font-semibold text-muted-foreground">Outstanding</p><p className="font-display text-2xl font-semibold text-warning"><CountUp value={outstanding} format={money} /></p></div>
        </div>
        <section className="card-chunky p-4">
          <h2 className="text-lg font-semibold">Pending payments</h2>
          <ul className="mt-2 divide-y divide-border">
            {due.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><p className="font-semibold">{t.customer}</p><p className="text-xs font-medium text-muted-foreground">{t.destination} · {money(t.total - t.paid)} due</p></div>
                <Chunky disabled={!editable} variant="module" size="sm" onClick={() => start(t.id)}>Record</Chunky>
              </li>
            ))}
            {due.length === 0 && <li className="py-6 text-center font-semibold">Everyone's paid up!</li>}
          </ul>
        </section>
        <section className="card-chunky p-4">
          <h2 className="text-lg font-semibold">Recent payments</h2>
          <ul className="mt-2 divide-y divide-border">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div><p className="font-semibold">{p.customer}</p><p className="text-xs font-medium text-muted-foreground">{p.method} · {timeAgo(p.at)}</p></div>
                <p className="font-semibold text-success">+{money(p.amount)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="fixed inset-x-4 bottom-24 z-30 md:hidden"><Chunky disabled={!editable} block size="lg" onClick={() => start()}><Wallet className="h-5 w-5" /> Record payment</Chunky></div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mod-finance mx-auto max-w-lg">
          <DrawerTitle className="px-5 pt-4 text-2xl">Record payment</DrawerTitle>
          {done ? (
            <div className="flex flex-col items-center gap-3 p-10"><CheckCircle2 className="h-24 w-24 animate-pop text-success" /><p className="font-display text-2xl font-semibold">Payment saved!</p></div>
          ) : (
            <div className="space-y-4 p-5">
              <select value={tripId} onChange={(e) => setTripId(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-card px-3 font-semibold">
                {trips.map((t) => <option key={t.id} value={t.id}>{t.customer} — {t.destination}</option>)}
              </select>
              <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="h-14 w-full rounded-xl border border-input px-4 font-display text-2xl font-semibold outline-none focus:border-primary" />
              <div className="flex flex-wrap gap-2">
                {["Bank transfer", "Card", "Cash", "UPI"].map((m) => (
                  <button key={m} onClick={() => setMethod(m)} className={cn("rounded-full border px-4 py-2 text-sm font-semibold", method === m ? "border-primary bg-accent" : "border-border")}>{m}</button>
                ))}
              </div>
              <Chunky block size="lg" disabled={!editable || !tripId || !Number(amount)} onClick={save}>Save payment</Chunky>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
