import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { seedLeads, seedPayments, seedTasks, seedTrips } from "./mock-data";
import type { Lead, LeadStatus, Payment, Role, Task, Trip } from "./types";
import { usePortal } from './portal-context';
import { canEdit } from './portals';

/**
 * Local-state service layer. Swap these implementations for REST calls later;
 * components only use the actions exposed here.
 */
interface Store {
  role: Role;
  me: string;
  leads: Lead[];
  trips: Trip[];
  tasks: Task[];
  payments: Payment[];
  streak: number;
  addLead: (l: Omit<Lead, "id" | "createdAt" | "activity" | "score" | "scoreReason">) => Lead;
  setLeadStatus: (id: string, s: LeadStatus) => void;
  addNote: (id: string, text: string) => void;
  sendWhatsApp: (id: string, text: string) => void;
  setFollowUp: (id: string, iso: string) => void;
  convertToTrip: (id: string, total: number) => Trip | undefined;
  toggleTask: (id: string) => void;
  recordPayment: (tripId: string, amount: number, method: string) => void;
}

const Ctx = createContext<Store | null>(null);
const uid = (p: string) => p + Math.random().toString(36).slice(2, 7).toUpperCase();
const stamp = () => new Date().toISOString();
const statusLabel: Record<LeadStatus, string> = {
  new: "New", contacted: "Contacted", fare_shared: "Fare Shared", quote_sent: "Quote Sent", confirmed: "Confirmed", lost: "Lost",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const { role } = usePortal();
  const requireEdit = (page: string) => { if (!canEdit(role, page)) throw new Error('This page is view-only for your role.'); };
  const [leads, setLeads] = useState(seedLeads);
  const [trips, setTrips] = useState(seedTrips);
  const [tasks, setTasks] = useState(seedTasks);
  const [payments, setPayments] = useState(seedPayments);

  const store = useMemo<Store>(() => {
    const patchLead = (id: string, fn: (l: Lead) => Lead) => { requireEdit('enquiries'); setLeads((ls) => ls.map((l) => (l.id === id ? fn(l) : l))); };
    return {
      role, me: "a1", leads, trips, tasks, payments, streak: 12,
      addLead: (input) => {
        requireEdit('enquiries');
        const lead: Lead = {
          ...input, id: uid("L"), createdAt: stamp(), score: 6, scoreReason: "New lead, details captured",
          activity: [{ id: uid("A"), kind: "status", text: "Enquiry created", at: stamp() }],
        };
        setLeads((ls) => [lead, ...ls]);
        return lead;
      },
      setLeadStatus: (id, s) => patchLead(id, (l) => ({
        ...l, status: s, activity: [{ id: uid("A"), kind: "status", text: `Status → ${statusLabel[s]}`, at: stamp() }, ...l.activity],
      })),
      addNote: (id, text) => patchLead(id, (l) => ({ ...l, activity: [{ id: uid("A"), kind: "note", text, at: stamp() }, ...l.activity] })),
      sendWhatsApp: (id, text) => patchLead(id, (l) => ({
        ...l, status: l.status === "new" ? "contacted" : l.status,
        activity: [{ id: uid("A"), kind: "wa_out", text, at: stamp() }, ...l.activity],
      })),
      setFollowUp: (id, iso) => patchLead(id, (l) => ({ ...l, followUp: iso })),
      convertToTrip: (id, total) => {
        requireEdit('trips');
        const l = leads.find((x) => x.id === id);
        if (!l) return undefined;
        const trip: Trip = {
          id: uid("T"), leadId: l.id, customer: l.name, destination: l.destination, flag: "✈️",
          start: l.travelDate, end: l.returnDate ?? l.travelDate, pax: l.pax, total, paid: 0, status: "confirmed", service: l.service,
        };
        setTrips((ts) => [trip, ...ts]);
        patchLead(id, (x) => ({ ...x, status: "confirmed", activity: [{ id: uid("A"), kind: "status", text: "Converted to trip", at: stamp() }, ...x.activity] }));
        return trip;
      },
      toggleTask: (id) => { requireEdit('tasks'); setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); },
      recordPayment: (tripId, amount, method) => {
        requireEdit('finance');
        const trip = trips.find((t) => t.id === tripId);
        if (!trip) return;
        setTrips((ts) => ts.map((t) => {
          if (t.id !== tripId) return t;
          const paid = Math.min(t.total, t.paid + amount);
          return { ...t, paid, status: paid >= t.total && t.status === "confirmed" ? "paid" : t.status };
        }));
        setPayments((ps) => [{ id: uid("P"), tripId, customer: trip.customer, amount, method, at: stamp() }, ...ps]);
      },
    };
  }, [role, leads, trips, tasks, payments]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}
