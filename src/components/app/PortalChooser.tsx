import { Link } from '@tanstack/react-router';
import { Briefcase, UserRound, Users, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import { roles, roleNames } from '@/lib/portals';
const icons = { agent: UserRound, manager: Users, finance: Wallet, admin: ShieldCheck };
const mods = { agent: 'mod-enquiries', manager: 'mod-reports', finance: 'mod-finance', admin: 'mod-settings' };
export function PortalChooser() {
  return <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-10">
    <div className="mb-8 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Briefcase className="h-5 w-5" /></span><h1 className="text-2xl font-semibold">TravelOS</h1></div>
    <div className="grid gap-4 sm:grid-cols-2">{roles.map(role => { const Icon = icons[role]; return <Link key={role} to={`/${role}/login`} className={`${mods[role]} card-chunky flex items-center gap-4 p-5`}><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mod-soft text-mod"><Icon className="h-6 w-6" /></span><h2 className="flex-1 text-lg font-semibold">{roleNames[role]}</h2><ArrowRight className="h-5 w-5 text-muted-foreground" /></Link>; })}</div>
  </main>;
}