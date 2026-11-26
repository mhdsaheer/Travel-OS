import { canAccess, canEdit } from '@/lib/portals';
import { PortalLink as Link, usePortalNavigate as useNavigate, usePortal } from "@/lib/portal-context";
import { AlertCircle, CalendarClock, CheckCircle2, Flame, Plane, Plus, Sparkles, UserPlus, Wallet, Inbox, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useShell } from "@/components/app/AppShell";
import { CountUp, ProgressRing, StatusBadge, WhatsAppButton } from "@/components/app/ui";
import { agency, agents, revenueByMonth } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";


export function Home() {
  const { leads, trips, tasks, role, me, toggleTask, sendWhatsApp } = useStore();
  const { openNewEnquiry } = useShell();
  const navigate = useNavigate();

  const owner = role === "manager" || role === "admin";
  const mine = owner ? leads : leads.filter((l) => l.agentId === me);
  const newLeads = mine.filter((l) => l.status === "new");
  const goal = 8; const handled = Math.min(goal, mine.filter((l) => l.status !== "new").length);
  const pending = trips.filter((t) => t.paid < t.total);
  const weekTrips = trips.filter((t) => { const d = (new Date(t.start).getTime() - Date.now()) / 864e5; return d >= -1 && d <= 7; });
  const overdue = tasks.filter((t) => !t.done && new Date(t.due) < new Date(new Date().toDateString()));
  const today = tasks.filter((t) => t.agentId === me).slice(0, 3);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = usePortal().name.split(" ")[0];

  const metrics = [
    { label: "New leads", value: newLeads.length, icon: Sparkles, to: "/enquiries" as const, cls: "mod-enquiries" },
    { label: "Follow-ups due", value: mine.filter((l) => l.status === "contacted" || l.status === "fare_shared").length, icon: CalendarClock, to: "/enquiries" as const, cls: "mod-enquiries" },
    { label: "Overdue tasks", value: overdue.length, icon: AlertCircle, to: "/tasks" as const, cls: "mod-tasks" },
    { label: "Trips this week", value: weekTrips.length, icon: Plane, to: "/trips" as const, cls: "mod-trips" },
    { label: "Pending payments", value: pending.length, icon: Wallet, to: "/finance" as const, cls: "mod-finance" },
    { label: "Conversions", value: mine.filter((l) => l.status === "confirmed").length, icon: TrendingUp, to: "/reports" as const, cls: "mod-reports" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <section className="card-chunky flex items-center gap-5 p-5">
        <div className="relative">
          <ProgressRing value={handled} max={goal} />
          <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold">{handled}/{goal}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-muted-foreground">{agency.name}</p>
          <h1 className="text-2xl font-semibold">{greet}, {name}!</h1>
          <p className="text-sm font-medium text-muted-foreground">
            {newLeads.length === 0 ? "All new leads handled. Great work!" : `Today's goal: contact ${goal} leads — ${newLeads.length} new waiting.`}
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-warning-soft px-3 py-2 text-warning">
          <Flame className="h-6 w-6" /><span className="font-display text-lg font-semibold leading-none">12</span><span className="text-[10px] font-medium">day streak</span>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-3">
        {[
          { label: "New Enquiry", icon: Plus, cls: "mod-enquiries", onClick: openNewEnquiry },
          { label: "Record Payment", icon: Wallet, cls: "mod-finance", onClick: () => navigate({ to: "/finance" }) },
          { label: "Add Customer", icon: UserPlus, cls: "mod-customers", onClick: () => navigate({ to: "/customers" }) },
          { label: "Create Trip", icon: Plane, cls: "mod-trips", onClick: () => navigate({ to: "/trips" }) },
        ].map((a) => (
          <button disabled={!canEdit(role, a.cls.replace("mod-", ""))} key={a.label} onClick={a.onClick} className={cn(a.cls, "group flex flex-col items-center gap-2 text-center text-xs font-medium text-muted-foreground")}>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-mod-soft text-mod transition-colors group-hover:bg-mod group-hover:text-mod-ink"><a.icon className="h-5 w-5" /></span>
            {a.label}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.filter(m => canAccess(role, m.to.slice(1))).map((m) => (
          <Link key={m.label} to={m.to} className={cn(m.cls, "card-chunky chunky p-4 [--chunky-lip:var(--border)]")}>
            <m.icon className="h-6 w-6 text-mod" />
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight"><CountUp value={m.value} /></p>
            <p className="text-sm font-semibold text-muted-foreground">{m.label}</p>
          </Link>
        ))}
      </section>

      {owner && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="card-chunky p-5">
            <h2 className="text-lg font-semibold">Revenue · last 6 months</h2>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => formatMoney(v, agency.currency)} cursor={{ fill: "var(--secondary)" }} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[10, 10, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-chunky p-5">
            <h2 className="text-lg font-semibold">AI insights</h2>
            <ul className="mt-3 space-y-3 text-sm font-medium">
              <li>Umrah enquiries are up 40% this week — prioritise Makkah packages.</li>
              <li>{pending.length} trips have balance due — send reminders today.</li>
              <li>Fatima converts 2× faster on WhatsApp replies under 10 min.</li>
            </ul>
          </div>
        </section>
      )}

      {canAccess(role, "enquiries") && <section className="grid gap-4 md:grid-cols-2">
        <div className="card-chunky p-5 mod-enquiries">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Recent enquiries</h2><Link to="/enquiries" className="text-sm font-semibold text-mod">See all</Link></div>
          <ul className="mt-3 divide-y divide-border">
            {mine.slice(0, 5).map((l) => (
              <li key={l.id}>
                <Link to="/enquiries/$id" params={{ id: l.id }} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold">{l.name}</p><p className="text-xs font-medium text-muted-foreground">{l.destination} · {timeAgo(l.createdAt)}</p></div>
                  <StatusBadge status={l.status} />
                  <WhatsAppButton disabled={!canEdit(role, "enquiries")} size="icon" onClick={() => sendWhatsApp(l.id, "Hi! Following up on your enquiry")} />
                </Link>
              </li>
            ))}
            {mine.length === 0 && <li className="py-6 text-center"><button disabled={!canEdit(role, "enquiries")} onClick={openNewEnquiry} className="font-semibold text-primary">+ Add your first enquiry</button></li>}
          </ul>
        </div>
        <div className="card-chunky p-5 mod-tasks">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Today's tasks</h2><Link to="/tasks" className="text-sm font-semibold text-mod">All tasks</Link></div>
          <ul className="mt-3 space-y-2">
            {today.map((t) => (
              <li key={t.id}>
                <button disabled={!canEdit(role, "tasks")} onClick={() => toggleTask(t.id)} className="flex w-full items-center gap-3 rounded-xl p-2 text-start hover:bg-secondary">
                  <CheckCircle2 className={cn("h-7 w-7 shrink-0", t.done ? "text-success" : "text-border")} />
                  <span className={cn("font-medium", t.done && "text-muted-foreground line-through")}>{t.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>}

      {canEdit(role, "enquiries") && <div className="fixed inset-x-4 bottom-24 z-30 md:hidden">
        <button disabled={!canEdit(role, "enquiries")} onClick={openNewEnquiry} className="chunky flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground [--chunky-lip:var(--primary-lip)]">
          <Inbox className="h-5 w-5" /> New enquiry
        </button>
      </div>}
    </div>
  );
}
