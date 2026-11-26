import { useLocation, useNavigate } from "@tanstack/react-router";
import { PortalLink as Link, usePortal } from '@/lib/portal-context';
import { canAccess, canEdit, portalPath } from '@/lib/portals';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Chunky } from './ui';
import { toast } from 'sonner';
import {
  BarChart3, Briefcase, CheckSquare, ChevronsLeft, Home, Inbox, MoreHorizontal, Plane, Settings, Users, Wallet, LogOut, Plug, ShieldCheck,
} from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useStore } from "@/lib/store";
import { agency } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NewEnquirySheet } from "./NewEnquirySheet";

type Path = "/" | "/enquiries" | "/trips" | "/finance" | "/customers" | "/tasks" | "/reports" | "/settings" | '/users' | '/integrations';
interface NavItem { to: Path; label: string; icon: typeof Home; mod: string; group: "MAIN" | "FINANCE" | "TOOLS" }

export const nav: NavItem[] = [
  { to: "/", label: "Home", icon: Home, mod: "mod-home", group: "MAIN" },
  { to: '/users', label: 'Users and roles', icon: ShieldCheck, mod: 'mod-settings', group: 'MAIN' },
  { to: "/enquiries", label: "Enquiries", icon: Inbox, mod: "mod-enquiries", group: "MAIN" },
  { to: "/trips", label: "Trips", icon: Plane, mod: "mod-trips", group: "MAIN" },
  { to: "/customers", label: "Customers", icon: Users, mod: "mod-customers", group: "MAIN" },
  { to: "/finance", label: "Finance", icon: Wallet, mod: "mod-finance", group: "FINANCE" },
  { to: "/reports", label: "Reports", icon: BarChart3, mod: "mod-reports", group: "FINANCE" },
  { to: "/tasks", label: "Tasks", icon: CheckSquare, mod: "mod-tasks", group: "TOOLS" },
  { to: "/settings", label: "Automation & Settings", icon: Settings, mod: "mod-settings", group: "TOOLS" },
  { to: '/integrations', label: 'Integrations', icon: Plug, mod: 'mod-settings', group: 'TOOLS' },
];

const ShellCtx = createContext<{ openNewEnquiry: () => void }>({ openNewEnquiry: () => {} });
export const useShell = () => useContext(ShellCtx);

function activeItem(pathname: string) {
  return nav.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to))) ?? { to: '/', label: 'Home', icon: Home, mod: 'mod-home', group: 'MAIN' };
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathname = '/' + location.pathname.split('/').slice(2).join('/');
  const { leads, tasks, role } = useStore();
  const user = usePortal();
  const navigate = useNavigate(); const queryClient = useQueryClient();
  const visibleNav = nav.filter(item => canAccess(role, item.to === '/' ? 'home' : item.to.slice(1)));
  const tabs = visibleNav.slice(0, 4).map(item => item.to);
  const logout = async () => { try { await queryClient.cancelQueries(); queryClient.clear(); const { error } = await supabase.auth.signOut(); if (error) throw error; await navigate({ to: `/${role}/login`, replace: true }); } catch { toast.error('Sign-out failed. Please try again.'); } };
  const [collapsed, setCollapsed] = useState(false);
  const [more, setMore] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const current = activeItem(pathname);
  const badges: Partial<Record<Path, number>> = {
    "/enquiries": leads.filter((l) => l.status === "new").length,
    "/tasks": tasks.filter((t) => !t.done).length,
  };
  const badge = (n?: number) => (n ? <span className="absolute -end-2 -top-1 min-w-5 rounded-full bg-destructive px-1 text-center text-[10px] font-semibold leading-5 text-destructive-foreground">{n > 9 ? "9+" : n}</span> : null);
  const reTap = (to: Path) => { if (to === current.to) window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <ShellCtx.Provider value={{ openNewEnquiry: () => { if (canEdit(role, 'enquiries')) setNewOpen(true); } }}>
      <div className={cn("min-h-screen md:flex", current.mod)}>
        {/* Desktop sidebar */}
        <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-e border-border bg-sidebar transition-[width] duration-200 md:flex", collapsed ? "w-20" : "w-64")}>
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Briefcase className="h-5 w-5" /></div>
            {!collapsed && <div className="min-w-0"><p className="font-display text-lg font-semibold leading-tight">TravelOS</p><p className="truncate text-xs font-medium text-muted-foreground">{agency.name}</p></div>}
          </div>
          <nav className="flex-1 space-y-4 overflow-y-auto px-3">
            {(["MAIN", "FINANCE", "TOOLS"] as const).map((g) => (
              <div key={g}>
                {!collapsed && <p className="px-3 pb-1 text-[11px] font-semibold tracking-widest text-muted-foreground">{g}</p>}
                {visibleNav.filter((n) => n.group === g).map((n) => {
                  const active = n.to === current.to;
                  return (
                    <Link key={n.to} to={n.to} title={collapsed ? n.label : undefined} onClick={() => reTap(n.to)}
                      className={cn(n.mod, "relative flex items-center gap-3 rounded-xl border px-3 py-2.5 font-semibold transition-colors",
                        active ? "border-mod bg-mod-soft text-foreground" : "border-transparent text-muted-foreground hover:bg-secondary")}>
                      <span className="relative"><n.icon className="h-6 w-6 text-mod" />{badge(badges[n.to])}</span>
                      {!collapsed && <span className="truncate">{n.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="space-y-2 border-t border-border p-3">
            <Chunky variant="ghost" size={collapsed ? 'icon' : 'sm'} onClick={logout} aria-label="Sign out"><LogOut className="h-4 w-4" />{!collapsed && 'Sign out'}</Chunky>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold">{initials(user.name)}</div>
              {!collapsed && <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.name}</p><p className="text-xs font-medium capitalize text-muted-foreground">{role}</p></div>}
               <Chunky variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar"><ChevronsLeft className={cn("h-5 w-5 transition-transform rtl:rotate-180", collapsed && "rotate-180")} /></Chunky>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-safe md:pb-10">{children}</main>

        {/* Mobile tabs */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
          {tabs.map((to) => {
            const n = visibleNav.find((x) => x.to === to); if (!n) return null; const active = to === current.to;
            return (
              <Link key={to} to={to} onClick={() => reTap(to)} className={cn(n.mod, "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                <span className={cn("relative rounded-xl px-3 py-1", active && "bg-mod-soft")}><n.icon className={cn("h-6 w-6", active ? "text-mod" : "")} />{badge(badges[to])}</span>
                {n.label}
              </Link>
            );
          })}
          <button onClick={() => setMore(true)} className={cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold", tabs.includes(current.to) ? "text-muted-foreground" : "text-foreground")}>
            <span className="relative rounded-xl px-3 py-1"><MoreHorizontal className="h-6 w-6" />{badge(badges["/tasks"])}</span>More
          </button>
        </nav>

        <Drawer open={more} onOpenChange={setMore}>
          <DrawerContent>
            <DrawerTitle className="px-5 pt-4 text-xl">More</DrawerTitle>
            <div className="grid grid-cols-3 gap-3 p-5">
              {visibleNav.filter((n) => !tabs.includes(n.to)).map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setMore(false)} className={cn(n.mod, "card-chunky relative flex flex-col items-center gap-2 p-4 text-center text-xs font-semibold")}>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-mod-soft"><n.icon className="h-6 w-6 text-mod" />{badge(badges[n.to])}</span>
                  {n.label.replace(" & Settings", "")}
                </Link>
              ))}
            </div>
            <div className="space-y-3 px-5 pb-6"><p className="text-sm font-semibold">{user.name} · <span className="capitalize">{role}</span></p><Chunky variant="outline" block onClick={logout}><LogOut className="h-4 w-4" />Sign out</Chunky></div>
          </DrawerContent>
        </Drawer>

        {canEdit(role, 'enquiries') && <NewEnquirySheet open={newOpen} onOpenChange={setNewOpen} />}
      </div>
    </ShellCtx.Provider>
  );
}

