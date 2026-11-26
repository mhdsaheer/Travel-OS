import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '@/components/screens/Reports';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/finance/reports')({ head: () => portalHead('Finance Reports', 'TravelOS finance portal — reports.'), component: Reports });
