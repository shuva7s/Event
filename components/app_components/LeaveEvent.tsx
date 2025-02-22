"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { leaveEvent } from "@/lib/actions/event.actions";

const LeaveEvent = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleLeave() {
    setLoading(true);
    setHasLeft(true);
    const { success, error } = await leaveEvent(eventId);
    setLoading(false);
    
    if (!success) setHasLeft(false);
    else router.push("/");

    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Left successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
  }
  return (
    <Button
      disabled={loading || hasLeft}
      onClick={handleLeave}
      variant="destructive"
    >
      {loading ? "Leaving..." : "Leave"}
    </Button>
  );
};

export default LeaveEvent;
