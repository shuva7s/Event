"use client";

import React, { useState } from "react";
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

const EndEvent = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [ended, setEnded] = useState(false);

  async function handleStart() {
    setLoading(true);
    const { success, error } = await handleStartEnd({ eventId, type: "end" });
    setLoading(false);
    setEnded(true);
    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Event ended successfully"
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
        <Button className="flex-1" variant="destructive" disabled={ended || loading}>
          {loading ? "Ending..." : "End event"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End event</DialogTitle>
          <DialogDescription>
            Are you sure you want to end the event?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-1">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleStart}>
              End event
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndEvent;
