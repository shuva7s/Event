import Dp from "@/components/shared/cards/Dp";
import RevokeSession from "@/components/shared/RevokeSession";
import RevokeSessions from "@/components/shared/RevokeSessions";
import UnlinkAccount from "@/components/shared/UnlinkAccount";
import { auth } from "@/lib/auth";
import { Session, User } from "better-auth";
import { LaptopMinimal, Smartphone, Monitor } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SignOutButton from "@/components/shared/SignOutButton";
import EditProfile from "@/components/shared/EditProfile";

const DashboardPage = async () => {
  /* eslint-disable prefer-const */
  let [session, activeSessions, accounts] = await Promise.all([
    auth.api.getSession({
      headers: headers(),
    }),
    auth.api.listSessions({
      headers: headers(),
    }),
    auth.api.listUserAccounts({
      headers: headers(),
    }),
  ]);
  /* eslint-enable prefer-const */

  activeSessions = activeSessions.reverse();
  accounts = accounts.reverse();

  if (!session || !activeSessions) {
    return NextResponse.redirect(new URL("/sign-in"));
  }

  const user = session.user as User;
  const currentSession = session.session as Session;

  const parsedSessions = activeSessions
    .filter((s) => s.userAgent)
    .map((s) => {
      const parser = new UAParser(s.userAgent || "");
      const device = parser.getDevice();
      const os = parser.getOS();
      const browser = parser.getBrowser();

      return {
        id: s.id,
        token: s.token,
        isCurrent: currentSession.id === s.id,
        deviceType: device.type || "desktop",
        os: os.name || "Unknown OS",
        browser: browser.name || "Unknown Browser",
      };
    });

  return (
    <main className="w-full wrapper min-h-[80vh] fl_center">
      <Card className="w-full max-w-3xl shadow-xl shadow-accent dark:shadow-none md:p-2">
        <CardHeader className="flex-row items-center flex-wrap gap-4 relative">
          <Dp
            className="w-[3.5rem] h-[3.5rem]"
            src={user.image}
            name={user.name}
            expandable={true}
          />
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>

          <EditProfile className="absolute right-6 z-10 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <h2 className="font-semibold mb-4">Active sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 bg-accent dark:bg-accent/60 p-3 rounded-xl"
                >
                  <div className="h-16 aspect-square rounded-lg bg-background flex items-center justify-center">
                    {s.deviceType === "mobile" ? (
                      <Smartphone className="w-7 h-7" />
                    ) : s.deviceType === "desktop" ? (
                      <LaptopMinimal className="w-7 h-7" />
                    ) : (
                      <Monitor className="w-7 h-7" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-row flex-wrap justify-between items-center">
                    <p className="text-lg">
                      {s.os}, {s.browser}
                    </p>

                    {s.isCurrent ? (
                      <Badge className="h-8" variant="success">
                        Current
                      </Badge>
                    ) : (
                      <RevokeSession token={s.token} />
                    )}
                  </div>
                </div>
              ))}
              {activeSessions.length > 1 && <RevokeSessions />}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4">Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 bg-accent dark:bg-accent/60 p-3 rounded-xl"
                >
                  <div className="h-16 aspect-square rounded-lg bg-background flex items-center justify-center">
                    <Image
                      src={
                        a.provider === "google" ? "/google.svg" : "/github.svg"
                      }
                      alt={a.provider}
                      className={a.provider === "github" ? "dark:invert" : ""}
                      width={27}
                      height={27}
                    />
                  </div>
                  <div className="flex-1 flex flex-row flex-wrap justify-between items-center">
                    <p className="text-lg">
                      {a.provider === "google" ? "Google" : "Github"}
                    </p>
                    {accounts.length > 1 && (
                      <UnlinkAccount provider={a.provider} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row flex-wrap items-center justify-between">
          <p className="text-muted-foreground">Wanna sign out?</p>
          <SignOutButton />
        </CardFooter>
      </Card>
    </main>
  );
};

export default DashboardPage;
