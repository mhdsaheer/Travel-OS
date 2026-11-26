import { createFileRoute } from '@tanstack/react-router';
import { PortalLogin } from '@/components/app/PortalLogin';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/admin/login')({ head: () => portalHead('Admin login', 'Sign in to your TravelOS admin portal.'), component: () => <PortalLogin role="admin" /> });
