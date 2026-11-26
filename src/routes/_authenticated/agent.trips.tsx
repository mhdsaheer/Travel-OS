import { createFileRoute } from '@tanstack/react-router';
import { Trips } from '@/components/screens/Trips';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/agent/trips')({ head: () => portalHead('Agent Trips', 'TravelOS agent portal — trips.'), component: Trips });
