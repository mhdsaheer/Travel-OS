import { createFileRoute } from '@tanstack/react-router';
import { Enquiries } from '@/components/screens/Enquiries';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/admin/enquiries/')({ head: () => portalHead('Admin Enquiries', 'TravelOS admin portal — enquiries.'), component: Enquiries });
