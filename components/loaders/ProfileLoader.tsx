import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const ProfileLoader = () => {
  return (
    <Card className="w-full max-w-3xl shadow-xl shadow-accent dark:shadow-none md:p-2">
      <CardHeader className="flex-row items-center gap-4 relative">
        <Skeleton className="w-[3.5rem] h-[3.5rem] rounded-full flex-shrink-0" />
        <div className="w-full">
          <Skeleton className="w-[60%] h-7 rounded-2xl" />
          <Skeleton className="mt-2 h-4 w-[80%]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-32 h-6 rounded-2xl" />
        <div className="grid grid-cols-1 gap-3 mt-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <Skeleton className="w-32 h-6 rounded-2xl mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-between">
        <Skeleton className="h-4 w-20 rounded-2xl" />
        <Skeleton className="h-8 w-20 rounded-2xl" />
      </CardFooter>
    </Card>
  );
};

export default ProfileLoader;
