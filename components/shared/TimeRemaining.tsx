"use client";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const TimeRemaining = ({
  startDateTime,
  endDateTime,
  className,
  hasStarted,
  hasEnded,
}: {
  startDateTime: string;
  endDateTime: string;
  className?: string;
  hasStarted: boolean;
  hasEnded: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startDateTime).getTime();
      const end = new Date(endDateTime).getTime();

      if (now < start) {
        // Event is in the future
        const difference = start - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft(
          `${
            days > 0
              ? `${days}d ${hours}h ${minutes}m`
              : hours > 0
              ? `${hours}h ${minutes}m`
              : `${minutes}m`
          }`
        );
      } else if (hasStarted && !hasEnded) {
        setTimeLeft("Ongoing");
      } else if (now >= start && !hasStarted) {
        setTimeLeft("About to start");
      } else if (now > end) {
        setTimeLeft("Expired");
      } else {
        setTimeLeft("Ended");
      }
    };

    calculateTimeLeft(); // Initial calculation
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startDateTime, endDateTime, hasStarted, hasEnded]);

  return (
    <Badge
      variant={
        timeLeft === "Expired" || timeLeft === "Ended"
          ? "destructive"
          : timeLeft === "Ongoing" || timeLeft === "About to start"
          ? "success"
          : "secondary"
      }
      className={cn("py-1.5 font-normal", className)}
    >
      {timeLeft}
    </Badge>
  );
};

export default TimeRemaining;
