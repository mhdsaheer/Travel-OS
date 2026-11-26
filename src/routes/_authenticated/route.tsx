import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { isRole } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated')({ ssr: false, beforeLoad: async ({ location }) => { const { data, error } = await supabase.auth.getUser(); if (error || !data.user) { const role = location.pathname.split('/')[1]; throw redirect({ to: isRole(role) ? `/${role}/login` : '/auth' }); } }, component: Outlet });
