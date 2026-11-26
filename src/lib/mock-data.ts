import type { Agent, Lead, Payment, Task, Trip } from "./types";

const now = Date.now();
const ago = (min: number) => new Date(now - min * 60000).toISOString();
const inDays = (d: number) => new Date(now + d * 86400000).toISOString();

export const agents: Agent[] = [
  { id: "a1", name: "Fatima Al-Harbi", role: "agent" },
  { id: "a2", name: "Rahul Menon", role: "agent" },
  { id: "a3", name: "Omar Siddiqui", role: "manager" },
  { id: "a4", name: "Noura Khalid", role: "finance" },
];

export const agency = { name: "Safar Al Noor Travels", currency: "SAR" as const };

const mk = (p: Partial<Lead> & Pick<Lead, "id" | "name" | "destination" | "service" | "status">): Lead => ({
  phone: "+966 5" + String(p.id.charCodeAt(3) * 1234567).slice(0, 8),
  travelDate: inDays(14),
  pax: 2,
  source: "WhatsApp",
  priority: "medium",
  agentId: "a1",
  createdAt: ago(60),
  score: 6,
  scoreReason: "Clear dates, responsive on WhatsApp",
  activity: [{ id: p.id + "-1", kind: "wa_in", text: `Hi, looking for ${p.destination} options`, at: ago(60) }],
  ...p,
});

export const seedLeads: Lead[] = [
  mk({ id: "L101", name: "Abdullah Rahman", destination: "Makkah", service: "umrah", status: "new", pax: 4, createdAt: ago(8), score: 9, scoreReason: "Family of 4, dates fixed, budget shared", priority: "high", vip: true }),
  mk({ id: "L102", name: "Priya Nair", destination: "Dubai", service: "package", status: "new", createdAt: ago(25), phone: "+91 98470 22341" }),
  mk({ id: "L103", name: "Khalid Al-Otaibi", destination: "London", service: "flight", status: "contacted", createdAt: ago(90), score: 7 }),
  mk({ id: "L104", name: "Sara Mansour", destination: "Istanbul", service: "hotel", status: "fare_shared", createdAt: ago(200), agentId: "a2" }),
  mk({ id: "L105", name: "Mohammed Faisal", destination: "Madinah", service: "umrah", status: "confirmed", createdAt: ago(600), pax: 6, score: 8 }),
  mk({ id: "L106", name: "Anjali Sharma", destination: "Baku", service: "package", status: "new", createdAt: ago(40), agentId: "a2", phone: "+91 99001 45678" }),
  mk({ id: "L107", name: "Yousef Hamdan", destination: "Cairo", service: "flight", status: "quote_sent", createdAt: ago(1300), score: 5 }),
  mk({ id: "L108", name: "Layla Qasim", destination: "Kuala Lumpur", service: "visa", status: "lost", createdAt: ago(3000), score: 3, scoreReason: "No reply for 3 days" }),
  mk({ id: "L109", name: "Hassan Ali", destination: "Makkah", service: "hajj", status: "contacted", createdAt: ago(150), pax: 2, score: 8, vip: true }),
];

export const seedTrips: Trip[] = [
  { id: "T201", customer: "Mohammed Faisal", destination: "Madinah", flag: "🇸🇦", start: inDays(3), end: inDays(10), pax: 6, total: 28800, paid: 14400, status: "confirmed", service: "umrah" },
  { id: "T202", customer: "Reem Al-Saud", destination: "Paris", flag: "🇫🇷", start: inDays(6), end: inDays(13), pax: 2, total: 19500, paid: 19500, status: "ticketed", service: "package" },
  { id: "T203", customer: "Vikram Iyer", destination: "Dubai", flag: "🇦🇪", start: inDays(0), end: inDays(4), pax: 3, total: 8200, paid: 8200, status: "paid", service: "hotel" },
  { id: "T204", customer: "Aisha Bakr", destination: "Jakarta", flag: "🇮🇩", start: inDays(-12), end: inDays(-4), pax: 1, total: 4300, paid: 4300, status: "travelled", service: "flight" },
  { id: "T205", customer: "Tariq Jamil", destination: "Makkah", flag: "🇸🇦", start: inDays(20), end: inDays(30), pax: 4, total: 22000, paid: 5000, status: "confirmed", service: "umrah" },
];

export const seedTasks: Task[] = [
  { id: "K1", title: "Send visa checklist to Mohammed Faisal", due: inDays(0), done: false, agentId: "a1" },
  { id: "K2", title: "Confirm hotel in Madinah (Pullman Zamzam)", due: inDays(0), done: false, agentId: "a1" },
  { id: "K3", title: "Chase balance from Tariq Jamil", due: inDays(-1), done: false, agentId: "a1" },
  { id: "K4", title: "Share Paris itinerary PDF", due: inDays(1), done: true, agentId: "a2" },
];

export const seedPayments: Payment[] = [
  { id: "P1", tripId: "T202", customer: "Reem Al-Saud", amount: 9500, method: "Bank transfer", at: ago(2000) },
  { id: "P2", tripId: "T201", customer: "Mohammed Faisal", amount: 14400, method: "Card", at: ago(900) },
  { id: "P3", tripId: "T203", customer: "Vikram Iyer", amount: 8200, method: "Cash", at: ago(300) },
];

export const revenueByMonth = [
  { month: "May", value: 84000 }, { month: "Jun", value: 96000 }, { month: "Jul", value: 72000 },
  { month: "Aug", value: 110000 }, { month: "Sep", value: 128000 }, { month: "Oct", value: 141000 },
];
