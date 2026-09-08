"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function IndexErrorAlert({
  message,
  onRetry,
  isRetrying,
}: {
  message?: string | null;
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  return (
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>Indexing failed</AlertTitle>
      <AlertDescription>
        {message || "Something went wrong while indexing this repository."}
      </AlertDescription>
      <AlertAction>
        <Button
          size="sm"
          variant="destructive"
          disabled={isRetrying}
          onClick={onRetry}
        >
          {isRetrying ? <Spinner className="size-3.5" /> : <RotateCcw className="size-3.5" />}
          Retry
        </Button>
      </AlertAction>
    </Alert>
  );
}
