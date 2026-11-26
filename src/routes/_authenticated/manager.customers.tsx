import { createFileRoute } from '@tanstack/react-router';
import { Customers } from '@/components/screens/Customers';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/manager/customers')({ head: () => portalHead('Manager Customers', 'TravelOS manager portal — customers.'), component: Customers });
