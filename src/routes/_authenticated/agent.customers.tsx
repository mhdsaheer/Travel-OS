import { createFileRoute } from '@tanstack/react-router';
import { Customers } from '@/components/screens/Customers';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/agent/customers')({ head: () => portalHead('Agent Customers', 'TravelOS agent portal — customers.'), component: Customers });
