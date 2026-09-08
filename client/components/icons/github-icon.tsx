import * as React from "react";
import { cn } from "@/lib/utils";

export type GitHubIconProps = React.SVGProps<SVGSVGElement>;

export const GitHubIcon = React.forwardRef<SVGSVGElement, GitHubIconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.86 3.16 8.98 7.54 10.44.55.1.75-.24.75-.53 0-.26-.01-.94-.02-1.85-3.07.67-3.72-1.48-3.72-1.48-.5-1.27-1.23-1.61-1.23-1.61-1-.68.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.45-.28-5.03-1.22-5.03-5.44 0-1.2.43-2.18 1.14-2.95-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.6 1.52.22 2.64.11 2.92.71.77 1.14 1.75 1.14 2.95 0 4.23-2.58 5.16-5.04 5.43.4.34.76 1.02.76 2.05 0 1.48-.01 2.68-.01 3.04 0 .3.2.64.76.53a10.53 10.53 0 0 0 7.53-10.44C23.02 5.24 18.27.5 12 .5Z"
      />
    </svg>
  )
);
GitHubIcon.displayName = "GitHubIcon";
