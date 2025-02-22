"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { handleEntry } from "@/lib/actions/event.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const AccRejBan = ({
  userId,
  eventId,
  isBanned,
}: {
  userId: string;
  eventId: string;
  isBanned: boolean;
}) => {
  const [rejectLoading, setRejectLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [bannedLoading, setBannedLoading] = useState(false);
  const [unBannedLoading, setUnBannedLoading] = useState(false);
  const [dis, setDis] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleAction(type: "accept" | "reject" | "block" | "unblock") {
    if (type === "block") {
      setBannedLoading(true);
    } else if (type === "accept") {
      setAcceptLoading(true);
      setDis(true);
    } else if (type === "reject") {
      setRejectLoading(true);
      setDis(true);
    } else if (type === "unblock") {
      setUnBannedLoading(true);
    }
    const { success, error } = await handleEntry({
      eventId,
      applicantId: userId,
      type,
    });

    if(!success){
      setDis(false);
    }

    toast({
      title: success
        ? "Success"
        : type === "block"
        ? "Blocked"
        : type === "accept"
        ? "Accepted"
        : "Rejected",
      description: error?.message,
      variant: success ? "success" : "destructive",
    });

    if (type === "block") {
      setBannedLoading(false);
    } else if (type === "accept") {
      setAcceptLoading(false);
    } else if (type === "reject") {
      setRejectLoading(false);
    } else if (type === "unblock") {
      setUnBannedLoading(false);
    }

    router.refresh();
  }
  return (
    <>
      {isBanned ? (
        <Button
          disabled={
            bannedLoading || acceptLoading || rejectLoading || unBannedLoading || dis
          }
          onClick={() => handleAction("unblock")}
          variant="success"
        >
          {unBannedLoading ? "Unbanning..." : "Unban"}
        </Button>
      ) : (
        <Button
          disabled={
            bannedLoading || acceptLoading || rejectLoading || unBannedLoading || dis
          }
          onClick={() => handleAction("block")}
          variant="destructive"
        >
          {bannedLoading ? "Banning..." : "Ban"}
        </Button>
      )}

      <Button
        disabled={
          bannedLoading || acceptLoading || rejectLoading || unBannedLoading || dis
        }
        onClick={() => handleAction("reject")}
        variant="secondary"
        className="border"
      >
        {rejectLoading ? "Rejecting..." : "Reject"}
      </Button>
      <Button
        disabled={
          bannedLoading || acceptLoading || rejectLoading || unBannedLoading || dis
        }
        onClick={() => handleAction("accept")}
      >
        {acceptLoading ? "Accepting..." : "Accept"}
      </Button>
    </>
  );
};

export default AccRejBan;
