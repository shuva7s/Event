import React from "react";
import { Skeleton } from "../ui/skeleton";

const EventLoader = () => {
  return (
    <section className="grid gap-5 md:gap-10 grid-cols-1 md:grid-cols-2">
      <Skeleton className="rounded-2xl w-full aspect-square max-h-[600px] md:sticky top-10" />
      <div className="flex flex-col gap-3 mb-5">
        <Skeleton className="w-[75%] h-16 rounded-2xl mt-3 mb-1" />
        <Skeleton className="w-[90%] h-6 rounded-2xl" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <div className="grid gap-4 grid-cols-3">
            <Skeleton className="h-10 rounded-2xl" />
            <Skeleton className="h-10 rounded-2xl" />
            <Skeleton className="h-10 rounded-2xl" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full h-36 rounded-2xl" />
          <Skeleton className="w-full h-36 rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-full h-40 rounded-2xl" />
          <Skeleton className="w-full h-40 rounded-2xl" />
        </div>
      </div>
    </section>
  );
};

export default EventLoader;
