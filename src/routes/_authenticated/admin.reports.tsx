import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '@/components/screens/Reports';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/reports')({ head: () => portalHead('Admin Reports', 'TravelOS admin portal — reports.'), component: Reports });
