import { createFileRoute } from '@tanstack/react-router';
import { PortalLogin } from '@/components/app/PortalLogin';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/manager/login')({ head: () => portalHead('Manager login', 'Sign in to your TravelOS manager portal.'), component: () => <PortalLogin role="manager" /> });
