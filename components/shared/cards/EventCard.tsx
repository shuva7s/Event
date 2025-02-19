import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import Dp from "./Dp";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TimeRemaining from "../TimeRemaining";

const EventCard = ({
  id,
  title,
  description,
  image,
  hasStarted,
  hasEnded,
  startDateTime,
  endDateTime,
  hostId,
  hostName,
  hostImage,
  currentUserId,
}: {
  id: string;
  title: string;
  description: string;
  image: string | null;
  hasStarted: boolean;
  hasEnded: boolean;
  startDateTime: string;
  endDateTime: string;
  hostId?: string;
  hostName?: string;
  hostImage?: string;
  currentUserId?: string;
}) => {
  console.log(currentUserId);
  return (
    <Card className="overflow-hidden break-inside-avoid group">
      <CardContent className="p-0 relative w-full aspect-video fl_center overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={200}
            height={200}
            quality={70}
            draggable={false}
            loading="lazy"
            className="w-full select-none group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-accent fl_center">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <TimeRemaining
          className="absolute top-6 left-6"
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          hasStarted={hasStarted}
          hasEnded={hasEnded}
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="h_sm -mt-1">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between flex flex-row flex-wrap gap-2">
        {hostId && hostImage && hostImage && (
          <Link
            href={`/user/${hostId}`}
            className="flex flex-row flex-wrap items-center gap-2"
          >
            <Dp className="w-9 h-9" src={hostImage} />
            <p className="max-w-[120px] truncate">{hostName}</p>
          </Link>
        )}
        <Button asChild>
          <Link href={`/events/${id}`}>View event</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
