import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/screens/Home';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/agent/')({ head: () => portalHead('Agent Home', 'TravelOS agent portal — home.'), component: Home });
