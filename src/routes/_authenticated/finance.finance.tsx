import { createFileRoute } from '@tanstack/react-router';
import { Finance } from '@/components/screens/Finance';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/finance/finance')({ head: () => portalHead('Finance Finance', 'TravelOS finance portal — finance.'), component: Finance });
