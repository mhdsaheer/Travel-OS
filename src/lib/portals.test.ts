import { describe, it, expect } from 'vitest';
import { portalPages, canAccess, canEdit } from './portals';
describe('Role portal permissions', () => {
  it('Agent only has Home, Enquiries, Trips and Customers', () => { expect(portalPages.agent).toEqual(['home', 'enquiries', 'trips', 'customers']); expect(canAccess('agent', 'finance')).toBe(false); });
  it('Manager only adds Reports to Agent pages', () => { expect(portalPages.manager).toEqual(['home', 'enquiries', 'trips', 'customers', 'reports']); expect(canAccess('manager', 'finance')).toBe(false); });
  it('Finance only has Home, Finance and Reports', () => { expect(portalPages.finance).toEqual(['home', 'finance', 'reports']); expect(canAccess('finance', 'enquiries')).toBe(false); });
  it('Admin can manage users, settings and integrations but only view operational pages', () => { expect(canEdit('admin', 'users')).toBe(true); expect(canEdit('admin', 'settings')).toBe(true); expect(canEdit('admin', 'integrations')).toBe(true); for (const page of ['enquiries', 'trips', 'customers', 'finance', 'tasks']) { expect(canAccess('admin', page)).toBe(true); expect(canEdit('admin', page)).toBe(false); } });
});