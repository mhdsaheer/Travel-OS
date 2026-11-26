import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { readIdentity } from '@/lib/portal-auth';
import { portalPath } from '@/lib/portals';
import { PortalProvider } from '@/lib/portal-context';
import { StoreProvider } from '@/lib/store';
import { AppShell } from '@/components/app/AppShell';
export const Route = createFileRoute('/_authenticated/manager')({
 beforeLoad: async () => { const identity = await readIdentity(); if (!identity) throw redirect({ to: '/manager/login' }); if (identity.role !== 'manager') throw redirect({ to: portalPath(identity.role, 'home') }); return { identity }; },
 component: PortalLayout,
});
function PortalLayout() { const { identity } = Route.useRouteContext(); return <PortalProvider identity={identity}><StoreProvider><AppShell><Outlet /></AppShell></StoreProvider></PortalProvider>; }
