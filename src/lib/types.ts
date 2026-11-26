export type Role = "admin" | "manager" | "agent" | "finance";
export type LeadStatus = "new" | "contacted" | "fare_shared" | "quote_sent" | "confirmed" | "lost";
export type Service = "flight" | "hotel" | "package" | "umrah" | "hajj" | "visa" | "insurance" | "transport";
export type Priority = "low" | "medium" | "high";
export type TripStatus = "confirmed" | "paid" | "ticketed" | "travelled";

export interface Agent { id: string; name: string; role: Role }

export interface Activity { id: string; kind: "wa_in" | "wa_out" | "note" | "status"; text: string; at: string }

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: Service;
  destination: string;
  travelDate: string;
  returnDate?: string;
  pax: number;
  source: string;
  priority: Priority;
  status: LeadStatus;
  agentId: string;
  createdAt: string;
  score: number;
  scoreReason: string;
  vip?: boolean;
  followUp?: string;
  activity: Activity[];
}

export interface Trip {
  id: string;
  leadId?: string;
  customer: string;
  destination: string;
  flag: string;
  start: string;
  end: string;
  pax: number;
  total: number;
  paid: number;
  status: TripStatus;
  service: Service;
}

export interface Task { id: string; title: string; due: string; done: boolean; agentId: string }

export interface Payment { id: string; tripId: string; customer: string; amount: number; method: string; at: string }
