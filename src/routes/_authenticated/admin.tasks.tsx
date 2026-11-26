import { createFileRoute } from '@tanstack/react-router';
import { Tasks } from '@/components/screens/Tasks';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/tasks')({ head: () => portalHead('Admin Tasks', 'TravelOS admin portal — tasks.'), component: Tasks });
