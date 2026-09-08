"use client";

import { RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { IndexStatus } from "@/lib/api";

type FilterStatus = "ALL" | IndexStatus;
type Visibility = "all" | "public" | "private";

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "READY", label: "Ready" },
  { value: "INDEXING", label: "Indexing" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

const VISIBILITY_OPTIONS: { value: Visibility; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

type DashboardHeaderProps = {
  search: string;
  onSearchChange: (search: string) => void;
  visibility: Visibility;
  onVisibilityChange: (visibility: Visibility) => void;
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  totalCount?: number;
  readyCount?: number;
  onSync: () => void;
  isSyncing?: boolean;
};

export function DashboardHeader({
  search,
  onSearchChange,
  visibility,
  onVisibilityChange,
  status,
  onStatusChange,
  totalCount = 0,
  readyCount = 0,
  onSync,
  isSyncing = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {readyCount} of {totalCount} repositories ready to chat with.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onSync}
          disabled={isSyncing}
          className="gap-1.5"
        >
          <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin")} />
          Sync with GitHub
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search repositories…"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1 rounded-4xl border border-input bg-input/30 p-1">
          {VISIBILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onVisibilityChange(option.value)}
              className={cn(
                "rounded-4xl px-3 py-1 text-xs font-medium transition-colors",
                visibility === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as FilterStatus)}
        >
          <SelectTrigger size="sm" className="min-w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

