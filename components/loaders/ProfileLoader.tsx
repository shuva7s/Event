import { Skeleton } from "../ui/skeleton";

const ProfileLoader = () => {
  return (
    <section className="w-full max-w-3xl flex flex-col gap-5">
      <Skeleton className="h-[5.5rem] w-full rounded-2xl" />
      <div>
        <Skeleton className="w-32 h-6 rounded-2xl mb-4 ml-2" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
      <div>
        <Skeleton className="w-32 h-6 rounded-2xl mb-4 ml-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-between">
        <Skeleton className="h-4 w-20 rounded-2xl" />
        <Skeleton className="h-8 w-20 rounded-2xl" />
      </div>
    </section>
  );
};

export default ProfileLoader;
