import { createFileRoute } from '@tanstack/react-router';
import { Customers } from '@/components/screens/Customers';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/customers')({ head: () => portalHead('Admin Customers', 'TravelOS admin portal — customers.'), component: Customers });
