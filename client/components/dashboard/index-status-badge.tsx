import { CheckCircle2, CircleDashed, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { IndexStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  IndexStatus,
  { label: string; variant: "secondary" | "outline" | "default" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  INDEXING: { label: "Indexing", variant: "outline" },
  READY: { label: "Ready", variant: "default" },
  FAILED: { label: "Failed", variant: "destructive" },
};

export function IndexStatusBadge({
  indexStatus,
  className,
}: {
  indexStatus: IndexStatus;
  className?: string;
}) {
  const { label, variant } = CONFIG[indexStatus];

  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      {indexStatus === "INDEXING" && <Spinner className="size-3" />}
      {indexStatus === "READY" && <CheckCircle2 className="size-3" />}
      {indexStatus === "FAILED" && <TriangleAlert className="size-3" />}
      {indexStatus === "PENDING" && <CircleDashed className="size-3" />}
      {label}
    </Badge>
  );
}
