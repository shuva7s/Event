"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
const RevokeSessions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sessionsRevoked, setSessionsRevoked] = useState(false);
  return (
    <Button
      size="sm"
      variant={"destructive"}
      disabled={loading || sessionsRevoked}
      onClick={async () => {
        setLoading(true);
        setSessionsRevoked(true);
        const res = await authClient.revokeOtherSessions();
        if (res.error) setSessionsRevoked(false);
        setLoading(false);
        router.refresh();
        toast({
          title: res.error ? "Error" : "Success",
          description: res.error?.message,
          variant: res.error ? "destructive" : "default",
        });
      }}
    >
      {loading ? <Loader2 className="animate-spin" /> : "Revoke other sessions"}
    </Button>
  );
};

export default RevokeSessions;
