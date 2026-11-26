import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/screens/Home';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/manager/')({ head: () => portalHead('Manager Home', 'TravelOS manager portal — home.'), component: Home });
