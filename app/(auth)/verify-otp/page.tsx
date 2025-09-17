import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VerifyOtpClient from "./_components/VerifyOtpClient";

function VerifyOtpSkeleton() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center space-y-2">
        <Skeleton className="h-6 w-24 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-12 w-12" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpSkeleton />}>
      <VerifyOtpClient />
    </Suspense>
  );
}
