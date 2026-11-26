import { supabase } from '@/integrations/supabase/client';
import { isRole } from './portals';
import type { PortalIdentity } from './portal-context';

export async function readIdentity(): Promise<PortalIdentity | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const [roleResult, profileResult] = await Promise.all([
    supabase.from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle(),
    supabase.from('profiles').select('display_name').eq('id', data.user.id).maybeSingle(),
  ]);
  if (roleResult.error || profileResult.error) throw new Error('Your account could not be loaded. Please try again.');
  if (!isRole(roleResult.data?.role)) throw new Error('Your account has no assigned portal. Please ask your administrator to assign a role.');
  return { id: data.user.id, role: roleResult.data.role, name: profileResult.data?.display_name ?? data.user.email ?? 'TravelOS user' };
}