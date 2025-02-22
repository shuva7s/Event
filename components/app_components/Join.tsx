"use client";
import { join } from "@/lib/actions/event.actions";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Join = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(false);
  const [joined, hasJoined] = useState(false);
  const router = useRouter();
  const handleSendRequest = async (eventId: string) => {
    setLoading(true);
    hasJoined(true);
    const { success, error } = await join(eventId);
    setLoading(false);

    if (!success) hasJoined(false);
    else router.refresh();

    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Joined successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
  };
  return (
    <Button
      disabled={loading || joined}
      onClick={() => {
        handleSendRequest(eventId);
      }}
      variant={"success"}
    >
      {loading ? "Joining..." : "Join"}
    </Button>
  );
};

export default Join;
