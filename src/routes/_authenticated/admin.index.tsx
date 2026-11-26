import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/screens/Home';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/')({ head: () => portalHead('Admin Home', 'TravelOS admin portal — home.'), component: Home });
