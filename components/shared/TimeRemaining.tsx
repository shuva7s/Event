// "use client";

// import { useEffect, useState } from "react";
// import { Badge } from "../ui/badge";
// import { cn } from "@/lib/utils";

// const TimeRemaining = ({
//   startDateTime,
//   endDateTime,
//   className,
//   hasStarted,
//   hasEnded,
// }: {
//   startDateTime: string;
//   endDateTime: string;
//   className?: string;
//   hasStarted: boolean;
//   hasEnded: boolean;
// }) => {
//   const [timeLeft, setTimeLeft] = useState<string>("");

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const start = new Date(startDateTime).getTime();
//       const end = new Date(endDateTime).getTime();

//       if (now < start) {
//         // Event is in the future
//         const difference = start - now;
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor(
//           (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//         );
//         const minutes = Math.floor(
//           (difference % (1000 * 60 * 60)) / (1000 * 60)
//         );

//         setTimeLeft(
//           `${
//             days > 0
//               ? `${days}d ${hours}h ${minutes}m`
//               : hours > 0
//               ? `${hours}h ${minutes}m`
//               : `${minutes}m`
//           }`
//         );
//       } else if (hasStarted && !hasEnded) {
//         setTimeLeft("Ongoing");
//       } else if (now >= start && !hasStarted) {
//         setTimeLeft("About to start");
//       } else if (now > end && !hasStarted) {
//         setTimeLeft("Expired");
//       } else {
//         setTimeLeft("Ended");
//       }
//     };

//     calculateTimeLeft(); // Initial calculation
//     const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

//     return () => clearInterval(interval);
//   }, [startDateTime, endDateTime, hasStarted, hasEnded]);

//   return (
//     <Badge
//       variant={
//         timeLeft === "Expired" || timeLeft === "Ended"
//           ? "destructive"
//           : timeLeft === "Ongoing" || timeLeft === "About to start"
//           ? "success"
//           : "secondary"
//       }
//       className={cn("py-1.5 font-normal", className)}
//     >
//       {timeLeft}
//     </Badge>
//   );
// };

// export default TimeRemaining;


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
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Handle edge case when less than a minute remains
        if (days === 0 && hours === 0 && minutes === 0) {
          setTimeLeft(`${seconds}s`);
        } else {
          setTimeLeft(
            `${
              days > 0
                ? `${days}d ${hours}h ${minutes}m`
                : hours > 0
                ? `${hours}h ${minutes}m`
                : `${minutes}m`
            }`
          );
        }
      } else if (hasStarted && !hasEnded) {
        setTimeLeft("Ongoing");
      } else if (now >= start && !hasStarted) {
        setTimeLeft("About to start");
      } else if (now > end && !hasStarted) {
        setTimeLeft("Expired");
      } else {
        setTimeLeft("Ended");
      }
    };

    calculateTimeLeft(); // Initial calculation
    
    // Update more frequently if we're close to the start time
    const intervalTime = new Date(startDateTime).getTime() - Date.now() < 60000 ? 1000 : 60000;
    const interval = setInterval(calculateTimeLeft, intervalTime);

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