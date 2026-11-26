import { createFileRoute } from '@tanstack/react-router';
import { PortalLogin } from '@/components/app/PortalLogin';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/agent/login')({ head: () => portalHead('Agent login', 'Sign in to your TravelOS agent portal.'), component: () => <PortalLogin role="agent" /> });
