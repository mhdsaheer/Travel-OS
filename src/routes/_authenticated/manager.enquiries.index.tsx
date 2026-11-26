import { createFileRoute } from '@tanstack/react-router';
import { Enquiries } from '@/components/screens/Enquiries';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/manager/enquiries/')({ head: () => portalHead('Manager Enquiries', 'TravelOS manager portal — enquiries.'), component: Enquiries });
