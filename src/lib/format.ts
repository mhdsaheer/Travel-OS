export type Currency = "SAR" | "AED" | "INR" | "QAR" | "KWD" | "OMR" | "BHD";

/** "SAR 12,400" — Indian grouping for INR ("INR 1,25,000"). */
export function formatMoney(amount: number, currency: Currency): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(amount));
  return `${currency} ${n}`;
}

export function timeAgo(iso: string, now = Date.now()): string {
  const m = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
