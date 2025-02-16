"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const RevokeSession = ({ token }: { token: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size="sm"
      variant={"destructive"}
      onClick={async () => {
        setLoading(true);
        const res = await authClient.revokeSession({
          token,
        });
        setLoading(false);
        router.refresh();
        toast({
          title: res.error ? "Error" : "Success",
          description: res.error?.message,
          variant: res.error ? "destructive" : "default",
        });
      }}
    >
      {loading ? "Revoking..." : "Revoke"}
    </Button>
  );
};

export default RevokeSession;
