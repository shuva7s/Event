"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

const SignOutButton = ({afterSignOutUrl = "/sign-in"}:{afterSignOutUrl?:string}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(afterSignOutUrl);
          router.refresh();
        },
        onError(ctx) {
          console.error("Error signing out:", ctx.error);
          toast({
            title: "Error",
            description: ctx.error.message ?? "Something went wrong",
            variant: "destructive",
          });
        },
      },
    });
    setLoading(false);
  };
  return (
    <Button variant="secondary" disabled={loading} onClick={handleSignOut}>
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
};

export default SignOutButton;
