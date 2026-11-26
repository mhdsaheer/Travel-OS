import { canEdit } from '@/lib/portals';
import { usePortal as usePermissionIdentity } from '@/lib/portal-context';
import { PortalLink as Link } from "@/lib/portal-context";
import { ModuleHeader, Tag, WhatsAppButton } from "@/components/app/ui";
import { initials } from "@/lib/format";
import { useStore } from "@/lib/store";


export function Customers() {
  const editable = canEdit(usePermissionIdentity().role, 'customers');
  const { leads, sendWhatsApp } = useStore();
  return (
    <div className="mod-customers">
      <ModuleHeader title="Customers" subtitle={`${leads.length} people`} />
      <ul className="mx-auto grid max-w-5xl gap-3 px-4 py-5 md:grid-cols-2">
        {leads.map((l) => (
          <li key={l.id}>
            <Link to="/enquiries/$id" params={{ id: l.id }} className="card-chunky flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mod-soft font-semibold">{initials(l.name)}</div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><p className="truncate font-semibold">{l.name}</p>{l.vip && <Tag kind="vip" />}</div><p className="text-xs font-medium text-muted-foreground">{l.phone}</p></div>
              <WhatsAppButton disabled={!editable} size="icon" onClick={() => sendWhatsApp(l.id, `Hi ${l.name.split(" ")[0]}!`)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
