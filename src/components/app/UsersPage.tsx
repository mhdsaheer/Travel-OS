import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { toast } from 'sonner';
import { listUsers, assignRole } from '@/lib/admin.functions';
import { isRole, roles, roleNames } from '@/lib/portals';
import { ModuleHeader } from './ui';
export function UsersPage() {
  const load = useServerFn(listUsers); const save = useServerFn(assignRole); const [busy, setBusy] = useState<string | null>(null);
  const query = useQuery({ queryKey: ['admin-users'], queryFn: () => load() });
  return <div className="mod-settings"><ModuleHeader title="Users and roles" /><div className="mx-auto max-w-3xl px-4 py-5">
    {query.isPending && <p role="status">Loading accounts…</p>}{query.error && <p role="alert" className="text-danger">{query.error.message}</p>}
    <ul className="space-y-3">{query.data?.map(user => <li key={user.id} className="card-chunky flex flex-wrap items-center justify-between gap-4 p-4"><p className="font-semibold">{user.display_name}</p><label className="text-sm"><span className="sr-only">Role for {user.display_name}</span><select className="h-10 rounded-xl border border-input bg-card px-3" value={user.role ?? ''} disabled={busy === user.id} onChange={async event => { const role = event.target.value; if (!isRole(role)) return; setBusy(user.id); try { await save({ data: { userId: user.id, role } }); await query.refetch(); toast.success('Role saved'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Role could not be saved'); } finally { setBusy(null); } }}><option value="" disabled>Unassigned</option>{roles.map(role => <option key={role} value={role}>{roleNames[role]}</option>)}</select></label></li>)}</ul>
  </div></div>;
}