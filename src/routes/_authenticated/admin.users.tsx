import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/components/app/UsersPage';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/users')({ head: () => portalHead('Admin Users', 'TravelOS admin portal — users.'), component: UsersPage });
