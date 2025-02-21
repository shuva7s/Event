"use client";
import { join } from "@/lib/actions/event.actions";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Join = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(false);
  const handleSendRequest = async (eventId: string) => {
    setLoading(true);
    const { success, error } = await join(eventId);
    setLoading(false);

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
      disabled={loading}
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
