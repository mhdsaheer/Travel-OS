import { createFileRoute } from '@tanstack/react-router';
import { PortalChooser } from '@/components/app/PortalChooser';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/')({ head: () => portalHead('Choose your portal', 'TravelOS Agent, Manager, Finance and Admin portals.'), component: PortalChooser });
