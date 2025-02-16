"use client";
import { sendRequest } from "@/lib/actions/event.actions";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const SendRequest = ({
  requested,
  eventId,
}: {
  requested: boolean;
  eventId: string;
}) => {
  const [rq, setRq] = useState(requested);
  const [loading, setLoading] = useState(false);
  const handleSendRequest = async (eventId: string) => {
    setLoading(true);
    const { success, error } = await sendRequest(eventId);
    setLoading(false);
    setRq(true);
    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Request sent successfully"
        : error?.message || "Something went wrong",
      variant: success ? "success" : "destructive",
    });
  };
  return (
    <Button
      disabled={rq || loading}
      onClick={() => {
        handleSendRequest(eventId);
      }}
      variant={rq ? "secondary" : "success"}
    >
      {rq ? "Request sent" : <>{loading ? "Sending..." : "Send Request"}</>}
    </Button>
  );
};

export default SendRequest;
