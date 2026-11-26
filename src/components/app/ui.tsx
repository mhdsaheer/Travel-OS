import { cva, type VariantProps } from "class-variance-authority";
import {
  Ban, CheckCircle2, CircleDot, FileText, Moon, Phone, Plane, Hotel, Package, Shield, Bus, Stamp, Send, Sparkles, Crown, MessageCircle,
} from "lucide-react";
import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LeadStatus, Service } from "@/lib/types";

export const chunkyVariants = cva(
  "chunky inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
  {
    variants: {
      variant: {
        go: "bg-primary text-primary-foreground [--chunky-lip:var(--primary-lip)]",
        module: "bg-mod text-mod-ink [--chunky-lip:var(--mod-lip)]",
        whatsapp: "bg-whatsapp text-primary-foreground [--chunky-lip:var(--whatsapp-lip)]",
        outline: "border border-border bg-card text-foreground [--chunky-lip:var(--border)]",
        ghost: "bg-transparent text-muted-foreground shadow-none active:translate-y-0",
        danger: "bg-destructive text-destructive-foreground [--chunky-lip:var(--danger)]",
      },
      size: { sm: "h-10 px-4 text-xs", md: "h-11 px-5 text-sm", lg: "h-14 px-6 text-base", icon: "h-10 w-10" },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "go", size: "md" },
  },
);

export const Chunky = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chunkyVariants>>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button ref={ref} className={cn(chunkyVariants({ variant, size, block }), className)} {...props} />
  ),
);
Chunky.displayName = "Chunky";

export function WhatsAppButton({ onClick, label = "WhatsApp", size = "sm", disabled = false }: { onClick?: () => void; label?: string; size?: "sm" | "md" | "icon"; disabled?: boolean }) {
  return (
    <Chunky disabled={disabled} variant="whatsapp" size={size} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick?.(); }} aria-label={label}>
      <MessageCircle className="h-4 w-4" />
      {size !== "icon" && <span>{label}</span>}
    </Chunky>
  );
}

const statusMeta: Record<LeadStatus, { label: string; icon: typeof CircleDot; cls: string }> = {
  new: { label: "New", icon: Sparkles, cls: "bg-info-soft text-info" },
  contacted: { label: "Contacted", icon: Phone, cls: "bg-warning-soft text-warning" },
  fare_shared: { label: "Fare Shared", icon: Send, cls: "bg-mod-soft text-foreground" },
  quote_sent: { label: "Quote Sent", icon: FileText, cls: "bg-secondary text-secondary-foreground" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, cls: "bg-success-soft text-success" },
  lost: { label: "Lost", icon: Ban, cls: "bg-danger-soft text-danger" },
};
export const leadStatuses = Object.keys(statusMeta) as LeadStatus[];
export const statusLabel = (s: LeadStatus) => statusMeta[s].label;

export function StatusBadge({ status }: { status: LeadStatus }) {
  const m = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", m.cls)}>
      <m.icon className="h-3.5 w-3.5" aria-hidden /> {m.label}
    </span>
  );
}

export function Tag({ kind }: { kind: "vip" | "umrah" | "hajj" }) {
  const cls = kind === "vip" ? "bg-vip-soft text-vip" : "bg-umrah-soft text-umrah";
  const Icon = kind === "vip" ? Crown : Moon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase", cls)}>
      <Icon className="h-3 w-3" aria-hidden /> {kind === "vip" ? "VIP" : kind === "umrah" ? "Umrah" : "Hajj"}
    </span>
  );
}

export const serviceMeta: Record<Service, { label: string; icon: typeof Plane }> = {
  flight: { label: "Flight", icon: Plane }, hotel: { label: "Hotel", icon: Hotel }, package: { label: "Package", icon: Package },
  umrah: { label: "Umrah", icon: Moon }, hajj: { label: "Hajj", icon: Moon }, visa: { label: "Visa", icon: Stamp },
  insurance: { label: "Insurance", icon: Shield }, transport: { label: "Transport", icon: Bus },
};

export function ModuleHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="module-band border-b border-border px-5 pb-5 pt-7">
      <div className="mx-auto flex max-w-5xl items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground"><span className="h-2 w-2 rounded-full bg-mod" />TravelOS</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function CountUp({ value, format = (n: number) => String(n) }: { value: number; format?: (n: number) => string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - start) / 600); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(n)}</>;
}

export function ProgressRing({ value, max, size = 88 }: { value: number; max: number; size?: number }) {
  const r = (size - 12) / 2; const c = 2 * Math.PI * r; const pct = max ? Math.min(1, value / max) : 0;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`${value} of ${max}`}>
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={7} className="fill-none stroke-secondary" />
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={7} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700" />
    </svg>
  );
}

export function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const colors = ["var(--primary)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--vip)"];
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {Array.from({ length: 60 }).map((_, i) => (
        <span key={i} className="confetti-piece absolute top-0 h-3 w-2 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, background: colors[i % colors.length], ["--dx" as string]: `${((i * 53) % 120) - 60}px`, ["--dur" as string]: `${1.2 + (i % 7) * 0.15}s` }} />
      ))}
    </div>
  );
}

export function useCelebrate() {
  const [show, setShow] = useState(false);
  return { show, fire: () => { setShow(true); setTimeout(() => setShow(false), 2200); } };
}
