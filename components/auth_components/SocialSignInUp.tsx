"use client";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ErrorContext } from "@better-fetch/fetch";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const SocialSignInUp = ({ login = true }: { login?: boolean }) => {
  const [reqForSignIn, setReqForSignIn] = useState(false);
  const { toast } = useToast();

  const handleSocialSignInUp = async (provider: "google" | "github") => {
    await authClient.signIn.social(
      {
        provider,
      },
      {
        onRequest: () => {
          setReqForSignIn(true);
        },
        onSuccess: async () => {
          // toast({
          //   title: "Success",
          //   description: login
          //     ? "You have signed in successfully."
          //     : "You have signed up successfully.",
          //   variant: "success",
          // });
        },

        onError: (ctx: ErrorContext) => {
          setReqForSignIn(false);
          toast({
            title: "Error",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-[450px] shadow-none bg-background/90 backdrop-blur-lg md:p-2 dark:border-none rounded-2xl">
      <CardHeader>
        <CardTitle>{login ? "Sign in" : "Sign up"}</CardTitle>
        <CardDescription className="text-base">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-accent-foreground/5 dark:bg-accent/50 dark:hover:bg-accent"
            variant="ghost"
            disabled={reqForSignIn}
            onClick={() => handleSocialSignInUp("google")}
          >
            <Image
              src="/google.svg"
              alt="google"
              width={20}
              height={20}
              priority={true}
            />
            Continue with Google
          </Button>

          <Button
            variant="ghost"
            className="w-full bg-accent-foreground/5 dark:bg-accent/50 dark:hover:bg-accent"
            disabled={reqForSignIn}
            onClick={() => handleSocialSignInUp("github")}
          >
            <Image
              src="/github.svg"
              className="dark:invert"
              alt="github"
              width={20}
              height={20}
              priority={true}
            />
            Continue with Github
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm dark:text-muted-foreground pb-3">
        {reqForSignIn ? (
          <Loader2 className="animate-spin text-primary" />
        ) : (
          <p>
            {login ? "Don't have an account? " : "Already have an account? "}
            <Link
              className="hover:underline text-primary"
              href={login ? "/sign-up" : "/sign-in"}
            >
              {login ? "Sign up" : "Sign in"}
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default SocialSignInUp;
