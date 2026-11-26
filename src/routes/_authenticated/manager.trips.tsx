import { createFileRoute } from '@tanstack/react-router';
import { Trips } from '@/components/screens/Trips';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/manager/trips')({ head: () => portalHead('Manager Trips', 'TravelOS manager portal — trips.'), component: Trips });
