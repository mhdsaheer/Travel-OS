import { createContext, useContext, type ReactNode, type MouseEventHandler } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import type { Role } from './types';
import { canAccess, portalPath } from './portals';

export interface PortalIdentity { id: string; name: string; role: Role }
const PortalContext = createContext<PortalIdentity | null>(null);
export function PortalProvider({ identity, children }: { identity: PortalIdentity; children: ReactNode }) { return <PortalContext.Provider value={identity}>{children}</PortalContext.Provider>; }
export function usePortal() { const value = useContext(PortalContext); if (!value) throw new Error('Portal identity unavailable'); return value; }
const paths = {
 agent: { home: '/agent', enquiries: '/agent/enquiries', trips: '/agent/trips', customers: '/agent/customers' },
 manager: { home: '/manager', enquiries: '/manager/enquiries', trips: '/manager/trips', customers: '/manager/customers', reports: '/manager/reports' },
 finance: { home: '/finance', finance: '/finance/finance', reports: '/finance/reports' },
 admin: { home: '/admin', enquiries: '/admin/enquiries', trips: '/admin/trips', customers: '/admin/customers', reports: '/admin/reports', finance: '/admin/finance', tasks: '/admin/tasks', settings: '/admin/settings', users: '/admin/users', integrations: '/admin/integrations' },
} as const;
function resolvePath(role: Role, path: string) {
  const page = path.split('/')[1] || 'home';
  if (!canAccess(role, page)) return portalPath(role, 'home');
  const match = Object.entries(paths[role]).find(([key]) => key === page);
  return match?.[1] ?? portalPath(role, 'home');
}
export function PortalLink({ to, params, title, ...props }: { to: string; params?: { id: string }; children?: ReactNode; className?: string; title?: string | undefined; onClick?: MouseEventHandler<HTMLAnchorElement>; 'aria-label'?: string }) {
  const { role } = usePortal();
  if (params && to === '/enquiries/$id' && role !== 'finance') {
    const detail = { agent: '/agent/enquiries/$id', manager: '/manager/enquiries/$id', admin: '/admin/enquiries/$id' } as const;
    return <Link {...props} {...(title ? { title } : {})} to={detail[role]} params={params} />;
  }
  return <Link {...props} {...(title ? { title } : {})} to={resolvePath(role, to)} />;
}
export function usePortalNavigate() {
  const { role } = usePortal(); const navigate = useNavigate();
  return ({ to, params }: { to: string; params?: { id: string } }) => {
    if (params && to === '/enquiries/$id' && role !== 'finance') { const detail = { agent: '/agent/enquiries/$id', manager: '/manager/enquiries/$id', admin: '/admin/enquiries/$id' } as const; return navigate({ to: detail[role], params }); }
    return navigate({ to: resolvePath(role, to) });
  };
}