import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const journeySteps = ["Enquiry", "Contacted", "Fare Shared", "Confirmed", "Paid", "Ticketed", "Travelled"] as const;

/** Booking lifecycle stepper. Clicking the current step triggers its next action. */
export function JourneyPath({ current, onAdvance, nextLabel }: { current: number; onAdvance?: (() => void) | undefined; nextLabel?: string | undefined }) {
  return (
    <div className="card-chunky p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Booking journey</p>
        <p className="text-xs text-muted-foreground">Step {current + 1} of {journeySteps.length}</p>
      </div>
      <ol className="mt-5 space-y-0">
        {journeySteps.map((step, i) => {
          const done = i < current; const now = i === current; const last = i === journeySteps.length - 1;
          return (
            <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
              {!last && <span className={cn("absolute start-[15px] top-8 h-[calc(100%-2rem)] w-0.5", done ? "bg-mod" : "bg-border")} aria-hidden />}
              <button
                type="button"
                disabled={!now || !onAdvance}
                onClick={onAdvance}
                aria-label={now && nextLabel ? `${step}: ${nextLabel}` : step}
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  done && "border-mod bg-mod text-mod-ink",
                  now && "animate-pulse-ring border-mod bg-card text-mod",
                  !done && !now && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </button>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pt-1">
                <span className={cn("text-sm", now ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground")}>{step}</span>
                {now && nextLabel && onAdvance && (
                  <button onClick={onAdvance} className="rounded-lg bg-mod-soft px-2.5 py-1 text-xs font-semibold text-mod hover:bg-mod hover:text-mod-ink">{nextLabel} →</button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
