import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import SimpleLoader from "@/components/loaders/SimpleLoader";
import Hero from "@/components/app_components/Hero";
import { Plus } from "lucide-react";
import { neon } from "@neondatabase/serverless";
import Footer from "@/components/app_components/Footer";
import MyEvents from "./MyEvents";
import SignInButton from "@/components/auth_components/SignInButton";
const HomePage = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  let events = [] as any[];
  if (session) {
    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);
    events = await sql`
    SELECT 
      e.*, 
      u.id AS host_id, 
      u.name AS host_name, 
      u.email AS host_email,
      u.image AS host_image
    FROM event e
    INNER JOIN membership m ON e.id = m.event_id
    INNER JOIN "user" u ON e.host_id = u.id
    WHERE m.user_id = ${userId}
    ORDER BY e.created_at DESC;
  `;
  }
  // console.log(events[0]);
  return (
    <>
      <main className="wrapper min-h-[80vh]">
        {session ? (
          <>
            <Hero />
            <section className="flex flex-row justify-between flex-wrap gap-4 py-5 items-center">
              <h1 className="h_sm">Your events</h1>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/create-event">
                  <Plus /> Create event
                </Link>
              </Button>
              <Button asChild size="icon" className="sm:hidden">
                <Link href="/create-event">
                  <Plus className="scale-125" />
                </Link>
              </Button>
            </section>
            <Suspense fallback={<SimpleLoader />}>
              <MyEvents events={events} currentUserId={session.user.id} />
            </Suspense>
          </>
        ) : (
          <>
            <section className="min-h-[83vh] fl_center flex-col text-center">
              <h1 className="h_lg">You are missing out</h1>
              <p className="p_md text-muted-foreground">
                Sign in to explore the world of events
              </p>
              <SignInButton />
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
