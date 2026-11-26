import { createFileRoute } from '@tanstack/react-router';
import { Enquiries } from '@/components/screens/Enquiries';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/agent/enquiries/')({ head: () => portalHead('Agent Enquiries', 'TravelOS agent portal — enquiries.'), component: Enquiries });
