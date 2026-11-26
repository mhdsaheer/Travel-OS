import type { Role } from './types';

export const roles: Role[] = ['agent', 'manager', 'finance', 'admin'];
export const roleNames: Record<Role, string> = { agent: 'Agent', manager: 'Manager', finance: 'Finance', admin: 'Admin' };
export const portalPages: Record<Role, string[]> = {
  agent: ['home', 'enquiries', 'trips', 'customers'],
  manager: ['home', 'enquiries', 'trips', 'customers', 'reports'],
  finance: ['home', 'finance', 'reports'],
  admin: ['home', 'users', 'settings', 'integrations', 'reports', 'enquiries', 'trips', 'customers', 'finance', 'tasks'],
};
export function isRole(value: unknown): value is Role { return roles.some(role => role === value); }
export function canAccess(role: Role, page: string) { return portalPages[role].includes(page); }
export function canEdit(role: Role, page: string) {
  return canAccess(role, page) && (role === 'admin' ? ['users', 'settings', 'integrations'].includes(page) : true);
}
export const homePaths = { agent: '/agent', manager: '/manager', finance: '/finance', admin: '/admin' } as const;
export function portalPath(role: Role, _page: 'home') { return homePaths[role]; }
export function portalHead(title: string, description: string) {
  return { meta: [ { title: `${title} — TravelOS` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — TravelOS` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' } ] };
}