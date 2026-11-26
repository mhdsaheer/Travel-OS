import { createFileRoute } from '@tanstack/react-router';
import { Finance } from '@/components/screens/Finance';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/finance')({ head: () => portalHead('Admin Finance', 'TravelOS admin portal — finance.'), component: Finance });
