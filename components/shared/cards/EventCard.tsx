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
  event,
  currentUserId,
}: {
  event: any;
  currentUserId: string;
}) => {
  console.log(currentUserId);
  console.log("event", event);
  return (
    <Card className="overflow-hidden break-inside-avoid">
      <CardContent className="p-0 relative w-full aspect-video fl_center">
        {event.image ? (
          <Image
            priority
            src={event.image}
            alt={event.title}
            width={200}
            height={200}
            quality={80}
            draggable={false}
            className="w-full select-none"
          />
        ) : (
          <div className="w-full h-full bg-accent fl_center">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <TimeRemaining
          className="absolute top-6 left-6"
          startDateTime={event.start_date_time}
          endDateTime={event.end_date_time}
          hasStarted={event.has_started}
          hasEnded={event.has_ended}
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="h_sm -mt-1">{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between flex flex-row flex-wrap gap-2">
        <Link
          href={`/user/${event.host_id}`}
          className="flex flex-row flex-wrap items-center gap-2"
        >
          <Dp className="w-9 h-9" src={event.host_image} />
          <p className="max-w-[120px] truncate">{event.host_name}</p>
        </Link>
        <Button asChild>
          <Link href={`/events/${event.id}`}>View event</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
