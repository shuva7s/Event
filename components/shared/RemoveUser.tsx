"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { removeUser } from "@/lib/actions/event.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const RemoveUser = ({
  eventId,
  targetUserId,
  targetUserName,
}: {
  eventId: string;
  targetUserId: string;
  targetUserName: string;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  async function handleRemoveUser() {
    setLoading(true);
    const { success, error } = await removeUser({ eventId, targetUserId });
    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "User removed successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
    setLoading(false);
    router.refresh();
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={loading} variant={"destructive"}>
          {loading ? "Removing..." : "Remove"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will remove{" "}
            <b>{targetUserName} </b>
            from the event.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-1">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleRemoveUser} variant={"destructive"}>
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveUser;
