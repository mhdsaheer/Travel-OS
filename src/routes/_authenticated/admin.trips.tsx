import { createFileRoute } from '@tanstack/react-router';
import { Trips } from '@/components/screens/Trips';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/trips')({ head: () => portalHead('Admin Trips', 'TravelOS admin portal — trips.'), component: Trips });
