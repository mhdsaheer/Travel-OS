import { createFileRoute } from '@tanstack/react-router';
import { Settings } from '@/components/screens/Settings';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/settings')({ head: () => portalHead('Admin Settings', 'TravelOS admin portal — settings.'), component: Settings });
