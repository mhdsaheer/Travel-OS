import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { isRole } from './portals';

export const listUsers = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (error || !data) throw new Error('Administrator access required.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const [profiles, roles] = await Promise.all([supabaseAdmin.from('profiles').select('id, display_name'), supabaseAdmin.from('user_roles').select('user_id, role')]);
  if (profiles.error || roles.error) throw new Error('Accounts could not be loaded.');
  return (profiles.data ?? []).map(profile => ({ ...profile, role: roles.data?.find(row => row.user_id === profile.id)?.role ?? null }));
});
export const assignRole = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: { userId: string; role: string }) => {
  if (!isRole(input.role) || !/^[0-9a-f-]{36}$/i.test(input.userId)) throw new Error('Invalid account or role.');
  return { userId: input.userId, role: input.role };
}).handler(async ({ data, context }) => {
  const result = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (result.error || !result.data) throw new Error('Administrator access required.');
  if (data.userId === context.userId && data.role !== 'admin') throw new Error('You cannot remove your own administrator access.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('user_roles').upsert({ user_id: data.userId, role: data.role });
  if (error) throw new Error('The role could not be saved.');
  return { success: true };
});