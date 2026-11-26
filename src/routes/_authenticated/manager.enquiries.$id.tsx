import { createFileRoute } from '@tanstack/react-router';
import { LeadDetail } from '@/components/screens/LeadDetail';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/_authenticated/manager/enquiries/$id')({ head: () => portalHead('Manager enquiry', 'TravelOS enquiry details and booking journey.'), component: LeadDetail });
