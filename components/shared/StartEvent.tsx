// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "../ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { handleStartEnd } from "@/lib/actions/event.actions";

// const StartEvent = ({
//   eventId,
//   startDateTime,
// }: {
//   eventId: string;
//   startDateTime: string;
// }) => {
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();
//   const router = useRouter();
//   const [started, setStarted] = useState(false);

//   const [isFutureEvent, setIsFutureEvent] = useState(
//     new Date(startDateTime) > new Date()
//   );

//   // Update every minute to check if event start time has passed
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsFutureEvent(new Date(startDateTime) > new Date());
//     }, 60000); // Runs every 60 seconds

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [startDateTime]);

//   async function handleStart() {
//     // Logic to start the event
//     setLoading(true);
//     const { success, error } = await handleStartEnd({
//       eventId,
//       type: "start",
//     });
//     setLoading(false);

//     setStarted(true);

//     toast({
//       title: success ? "Success" : "Error",
//       description: success
//         ? "Event started successfully"
//         : error?.message || "Something went wrong",
//       variant: success ? "success" : "destructive",
//     });
//     if (success) {
//       router.refresh();
//     }
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="flex-1" variant="success" disabled={isFutureEvent || started}>
//           {loading ? "Starting..." : "Start event"}
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Start event</DialogTitle>
//           <DialogDescription>
//             Are you sure you want to start the event?
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter className="gap-1">
//           <DialogClose asChild>
//             <Button variant="secondary">Cancel</Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button onClick={handleStart}>Start</Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default StartEvent;

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { handleStartEnd } from "@/lib/actions/event.actions";

const StartEvent = ({
  eventId,
  startDateTime,
}: {
  eventId: string;
  startDateTime: string;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [isFutureEvent, setIsFutureEvent] = useState(
    new Date(startDateTime) > new Date()
  );

  // Update to check if event start time has passed
  useEffect(() => {
    const checkEventTime = () => {
      setIsFutureEvent(new Date(startDateTime) > new Date());
    };

    checkEventTime(); // Initial check

    // Determine appropriate interval
    const timeUntilStart =
      new Date(startDateTime).getTime() - new Date().getTime();
    let intervalTime;

    if (timeUntilStart < 0) {
      // Already started
      intervalTime = 5000; // Check every 5 seconds
    } else if (timeUntilStart < 60000) {
      // Less than a minute away
      intervalTime = 500; // Check every 0.5 seconds
    } else if (timeUntilStart < 300000) {
      // Less than 5 minutes away
      intervalTime = 5000; // Check every 5 seconds
    } else {
      intervalTime = 60000; // Otherwise check every minute
    }

    const interval = setInterval(checkEventTime, intervalTime);
    return () => clearInterval(interval);
  }, [startDateTime]);

  async function handleStart() {
    // Logic to start the event
    setLoading(true);
    const { success, error } = await handleStartEnd({
      eventId,
      type: "start",
    });
    setLoading(false);

    setStarted(true);

    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Event started successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
    if (success) {
      router.refresh();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex-1"
          variant="success"
          disabled={isFutureEvent || started}
        >
          {loading ? "Starting..." : "Start event"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start event</DialogTitle>
          <DialogDescription>
            Are you sure you want to start the event?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-1">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleStart}>Start</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartEvent;
