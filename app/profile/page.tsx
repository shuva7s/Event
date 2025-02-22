import RevokeSession from "@/components/auth_components/RevokeSession";
import RevokeSessions from "@/components/auth_components/RevokeSessions";
import { auth } from "@/lib/auth";
import { Session, User } from "better-auth";
import { LaptopMinimal, Smartphone, Monitor } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { UAParser } from "ua-parser-js";
import { Badge } from "@/components/ui/badge";
import SignOutButton from "@/components/auth_components/SignOutButton";
import EditProfile from "@/components/auth_components/EditProfile";
import Dp from "@/components/app_components/cards/Dp";
import UnlinkAccount from "@/components/auth_components/UnlinkAccount";
import { Suspense } from "react";
import ProfileLoader from "@/components/loaders/ProfileLoader";
import SignInButton from "@/components/auth_components/SignInButton";

async function Renderer() {
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
    return (
      <section className="flex fl_center flex-col gap-4">
        <p className="h_md">You are not signed in</p>
        <SignInButton />
      </section>
    );
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
    <section className="w-full max-w-3xl flex flex-col gap-5">
      <div className="flex items-center gap-3 relative shadow-lg shadow-border dark:shadow-none dark:bg-accent border p-4 rounded-2xl flex-wrap">
        <Dp
          className="w-[3.5rem] h-[3.5rem]"
          src={user.image}
          name={user.name}
          expandable={true}
        />
        <div className="overflow-x-auto">
          <h1 className="font-semibold p_md md:h_sm">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        <EditProfile
          className="absolute right-4 top-4 z-10 text-muted-foreground"
          image={user.image || "https://github.com/shadcn.png"}
          name={user.name}
        />
      </div>

      <div>
        <h2 className="font-semibold mb-4 ml-2">Active sessions</h2>
        <div className="grid grid-cols-1 gap-4">
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

              <div className="flex-1 flex flex-row flex-wrap justify-between items-center relative">
                <p className="text-lg">
                  {s.os}, {s.browser}
                </p>

                {s.isCurrent ? (
                  <Badge className="h-8 absolute right-0" variant="success">
                    Current
                  </Badge>
                ) : (
                  <RevokeSession token={s.token} />
                )}
              </div>
            </div>
          ))}
        </div>
        {activeSessions.length > 1 && (
          <div className="w-full mt-5 flex justify-end">
            <RevokeSessions />
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold mb-4 ml-2">Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 bg-accent dark:bg-accent/60 p-3 rounded-xl"
            >
              <div className="h-16 aspect-square rounded-lg bg-background flex items-center justify-center">
                <Image
                  src={a.provider === "google" ? "/google.svg" : "/github.svg"}
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
                {accounts.length > 1 && <UnlinkAccount provider={a.provider} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-between">
        <p className="text-muted-foreground">Wanna sign out?</p>
        <SignOutButton afterSignOutUrl="/" />
      </div>
    </section>
  );
}

const profilePage = () => {
  return (
    <main className="w-full wrapper py-6 flex justify-center">
      <Suspense fallback={<ProfileLoader />}>
        <Renderer />
      </Suspense>
    </main>
  );
};

export default profilePage;
