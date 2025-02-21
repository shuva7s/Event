"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { leaveEvent } from "@/lib/actions/event.actions";

const LeaveEvent = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(false);
  let hasLeft = false;
  const router = useRouter();
  const { toast } = useToast();

  async function handleLeave() {
    setLoading(true);
    const { success, error } = await leaveEvent(eventId);
    setLoading(false);
    if (success) hasLeft = true;
    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Left successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
    if (success) {
      router.push("/");
    }
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
