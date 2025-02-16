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

const SocialSignInUp = ({
  login = true,
  isDev = false,
}: {
  login?: boolean;
  isDev?: boolean;
}) => {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleSignInWithGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setGithubLoading(true);
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
          toast({
            title: "Error",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
    setGithubLoading(false);
  };

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => {
          setGoogleLoading(true);
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
          toast({
            title: "Error",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
    setGoogleLoading(false);
  };

  return (
    <Card className="w-full max-w-[450px] shadow-none bg-background/90 backdrop-blur-lg md:p-2 dark:border-none rounded-2xl">
      <CardHeader>
        <CardTitle>{login ? "Sign in" : "Sign up"}</CardTitle>
        <CardDescription className="text-base text-foreground">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-accent-foreground/5 dark:bg-accent/50 dark:hover:bg-accent"
            variant="ghost"
            disabled={githubLoading || googleLoading}
            onClick={handleSignInWithGoogle}
          >
            <Image
              src="/google.svg"
              alt="google"
              width={20}
              height={20}
              priority={true}
            />
            {googleLoading ? (
              <span className="inline-flex items-center">
                Signing in <Loader2 className="ml-2 animate-spin" />
              </span>
            ) : (
              "Continue with Google"
            )}
          </Button>
          {isDev && (
            <Button
              variant="ghost"
              className="w-full bg-accent-foreground/5 dark:bg-accent/50 dark:hover:bg-accent"
              disabled={githubLoading || googleLoading}
              onClick={handleSignInWithGithub}
            >
              <Image
                src="/github.svg"
                className="dark:invert"
                alt="github"
                width={20}
                height={20}
                priority={true}
              />
              {githubLoading ? (
                <span className="inline-flex items-center">
                  Signing in <Loader2 className="ml-2 animate-spin" />
                </span>
              ) : (
                "Continue with Github"
              )}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm dark:text-muted-foreground pb-3">
        {githubLoading || googleLoading ? (
          <span>{login ? "Signing in" : "Signing up"}</span>
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
