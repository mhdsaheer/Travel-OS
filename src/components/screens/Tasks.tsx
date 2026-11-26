import { canEdit } from '@/lib/portals';
import { usePortal as usePermissionIdentity } from '@/lib/portal-context';
import { CheckCircle2 } from "lucide-react";
import { ModuleHeader } from "@/components/app/ui";
import { shortDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";


export function Tasks() {
  const editable = canEdit(usePermissionIdentity().role, 'tasks');
  const { tasks, toggleTask } = useStore();
  const open = tasks.filter((t) => !t.done).length;
  return (
    <div className="mod-tasks">
      <ModuleHeader title="Tasks" subtitle={open ? `${open} left to do` : "All done — nice!"} />
      <ul className="mx-auto max-w-3xl space-y-3 px-4 py-5">
        {tasks.map((t) => {
          const late = !t.done && new Date(t.due) < new Date(new Date().toDateString());
          return (
            <li key={t.id}>
              <button disabled={!editable} onClick={() => toggleTask(t.id)} className="card-chunky flex w-full items-center gap-3 p-4 text-start">
                <CheckCircle2 className={cn("h-8 w-8 shrink-0", t.done ? "text-success" : "text-border")} />
                <div className="flex-1"><p className={cn("font-semibold", t.done && "text-muted-foreground line-through")}>{t.title}</p>
                  <p className={cn("text-xs font-semibold", late ? "text-danger" : "text-muted-foreground")}>{late ? "Overdue · " : "Due "}{shortDate(t.due)}</p></div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
