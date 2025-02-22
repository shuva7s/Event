import React from "react";
import { Skeleton } from "../ui/skeleton";

const MembersAndReqsLoader = () => {
  return (
    <>
      <div className="flex flex-col gap-5 mt-8">
        <Skeleton className="w-full h-[3.5rem] rounded-2xl" />
        <Skeleton className="w-44 h-10  rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </>
  );
};

export default MembersAndReqsLoader;
