import { MessageCircle } from 'lucide-react';
import { ModuleHeader } from './ui';
export function IntegrationsPage() {
  return <div className="mod-settings"><ModuleHeader title="Integrations" /><ul className="mx-auto max-w-3xl space-y-3 px-4 py-5"><li className="card-chunky flex items-center gap-3 p-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mod-soft"><MessageCircle className="h-5 w-5 text-mod" /></span><div><p className="font-semibold">WhatsApp</p><p className="text-sm text-muted-foreground">Not connected</p></div></li></ul></div>;
}