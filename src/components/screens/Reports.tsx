import { ModuleHeader } from "@/components/app/ui";
import { agency, agents, revenueByMonth } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";


export function Reports() {
  const { leads } = useStore();
  const stages = [["Enquiries", leads.length], ["Contacted", leads.filter((l) => l.status !== "new").length], ["Confirmed", leads.filter((l) => l.status === "confirmed").length]] as const;
  const total = revenueByMonth.reduce((s, m) => s + m.value, 0);
  return (
    <div className="mod-reports">
      <ModuleHeader title="Reports" subtitle={`${formatMoney(total, agency.currency)} revenue in 6 months`} />
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:grid-cols-2">
        <section className="card-chunky p-5">
          <h2 className="text-lg font-semibold">Conversion funnel</h2>
          <div className="mt-3 space-y-2">
            {stages.map(([k, v]) => (
              <div key={k}><div className="flex justify-between text-sm font-semibold"><span>{k}</span><span>{v}</span></div>
                <div className="h-4 rounded-full bg-secondary"><div className="h-full rounded-full bg-mod" style={{ width: `${(v / Math.max(1, leads.length)) * 100}%` }} /></div></div>
            ))}
          </div>
        </section>
        <section className="card-chunky p-5">
          <h2 className="text-lg font-semibold">Team</h2>
          <table className="mt-3 w-full text-sm"><thead><tr className="text-start text-muted-foreground"><th className="text-start">Agent</th><th>Leads</th><th>Booked</th></tr></thead>
            <tbody>{agents.filter((a) => a.role === "agent").map((a) => (
              <tr key={a.id} className="font-semibold"><td className="py-2">{a.name}</td><td className="text-center">{leads.filter((l) => l.agentId === a.id).length}</td><td className="text-center">{leads.filter((l) => l.agentId === a.id && l.status === "confirmed").length}</td></tr>
            ))}</tbody></table>
        </section>
      </div>
    </div>
  );
}
