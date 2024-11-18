import React, { ReactNode, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface SuspenseWrapperProps {
  children: ReactNode;
}

const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
const SuspenseWrapper = ({ children }: SuspenseWrapperProps) => {
  return <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>;
};

export default SuspenseWrapper;
