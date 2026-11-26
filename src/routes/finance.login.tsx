import { createFileRoute } from '@tanstack/react-router';
import { PortalLogin } from '@/components/app/PortalLogin';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/finance/login')({ head: () => portalHead('Finance login', 'Sign in to your TravelOS finance portal.'), component: () => <PortalLogin role="finance" /> });
