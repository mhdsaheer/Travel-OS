import { createFileRoute } from '@tanstack/react-router';
import { PortalChooser } from '@/components/app/PortalChooser';
import { portalHead } from '@/lib/portals';
export const Route = createFileRoute('/auth')({ head: () => portalHead('Sign in', 'Choose your TravelOS sign-in portal.'), component: PortalChooser });
