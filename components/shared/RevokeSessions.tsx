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

  return (
    <Button
      size="sm"
      variant={"destructive"}
      onClick={async () => {
        setLoading(true);
        const res = await authClient.revokeOtherSessions();
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
