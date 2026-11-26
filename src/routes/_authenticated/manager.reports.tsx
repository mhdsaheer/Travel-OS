import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '@/components/screens/Reports';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/manager/reports')({ head: () => portalHead('Manager Reports', 'TravelOS manager portal — reports.'), component: Reports });
