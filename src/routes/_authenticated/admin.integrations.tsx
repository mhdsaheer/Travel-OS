import { createFileRoute } from '@tanstack/react-router';
import { IntegrationsPage } from '@/components/app/IntegrationsPage';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/integrations')({ head: () => portalHead('Admin Integrations', 'TravelOS admin portal — integrations.'), component: IntegrationsPage });
