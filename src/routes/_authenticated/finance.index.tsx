import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/screens/Home';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/finance/')({ head: () => portalHead('Finance Home', 'TravelOS finance portal — home.'), component: Home });
