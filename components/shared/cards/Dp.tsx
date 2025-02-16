import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Dp = ({
  expandable = false,
  src,
  name,
  className,
}: {
  expandable?: boolean;
  src?: string | null;
  name?: string;
  className?: string;
}) => {
  if (expandable) {
    return (
      <Dialog>
        <DialogTrigger>
          <Avatar className={cn(className)}>
            <AvatarImage
              alt="dp"
              src={src || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>
              <Skeleton className="w-full h-full bg-accent animate-pulse" />
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-full rounded-sm overflow-hidden relative">
            <Skeleton className="w-full h-full bg-accent animate-pulse absolute z-[-1]" />
            <Image
              src={src || "https://github.com/shadcn.png"}
              className="w-full"
              alt="dp"
              width={200}
              height={200}
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Avatar className={cn(className)}>
        <AvatarImage alt="dp" src={src || "https://github.com/shadcn.png"} />
        <AvatarFallback>
          <Skeleton className="w-full h-full bg-accent animate-pulse" />
        </AvatarFallback>
      </Avatar>
    );
  }
};

export default Dp;
