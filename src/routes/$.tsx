import { createFileRoute, redirect } from '@tanstack/react-router';
import { readIdentity } from '@/lib/portal-auth';
import { isRole, portalPath, portalHead } from '@/lib/portals';
export const Route = createFileRoute('/$')({ ssr: false, head: () => portalHead('Page unavailable', 'This TravelOS page is unavailable.'), beforeLoad: async ({ location }) => { const role = location.pathname.split('/')[1]; const identity = await readIdentity(); if (identity) throw redirect({ to: portalPath(identity.role, 'home') }); throw redirect({ to: isRole(role) ? `/${role}/login` : '/auth' }); } });