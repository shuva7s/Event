"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { deleteEvent } from "@/lib/actions/event.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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

const DeleteEvent = ({
  eventId,
  hasStarted,
  hasEnded,
}: {
  eventId: string;
  hasStarted: boolean;
  hasEnded: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  async function handleDelete() {
    setLoading(true);
    setHasDeleted(true);
    const { success, error } = await deleteEvent(eventId);
    setLoading(false);
    if (!success) setHasDeleted(false);
    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Event deleted successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
    if (success) {
      router.push("/");
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} disabled={hasStarted && !hasEnded || hasDeleted}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event? This action will delete
            this event.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-1">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"destructive"} onClick={handleDelete}>
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEvent;
