import Dp from "@/components/shared/cards/Dp";
import EventCard from "@/components/shared/cards/EventCard";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id || params.id.length !== 32) {
    redirect("/");
  }
  const session = await auth.api.getSession({
    headers: headers(),
  });

  const sql = neon(process.env.DATABASE_URL!);
  const userQuery = await sql`
  SELECT 
    u.*, 
    json_agg(
      json_build_object(
        'event', to_json(e.*),
        'role', m.role
      )
    ) AS events
  FROM "user" u
  LEFT JOIN membership m ON u.id = m.user_id
  LEFT JOIN event e ON m.event_id = e.id
  WHERE u.id = ${params.id}
  GROUP BY u.id;
`;

  const data = userQuery[0];

  console.log(data.events);

  if (!data) {
    redirect("/");
  }

  return (
    <main className="wrapper">
      <Suspense
        fallback={
          <div className="w-full wrapper min-h-[80vh] fl_center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <section className="flex flex-col gap-5 items-center text-center sm:flex-row sm:text-left py-5 border-b">
          <Dp
            src={data.image}
            expandable
            name={data.name}
            className="w-32 h-32"
          />
          <div className="flex flex-col gap-2 items-center sm:items-start">
            <h1 className="h_xl text-primary">{data.name}</h1>
            {session && session.user.id === params.id && (
              <Badge className="py-2.5 px-5" variant="secondary">
                You
              </Badge>
            )}
          </div>
        </section>
        <section className="py-5">
          <h1 className="h_md">Events</h1>

          {data.events.length > 0 ? (
            <div className="mt-5 columns-1 md:columns-2 lg:columns-3 space-y-4">
              {data.events.map((evtData: any) => (
                <EventCard
                  key={evtData.event.id}
                  id={evtData.event.id}
                  title={evtData.event.title}
                  description={evtData.event.description}
                  image={evtData.event.image}
                  hasStarted={evtData.event.has_started}
                  hasEnded={evtData.event.has_ended}
                  startDateTime={evtData.event.start_date_time}
                  endDateTime={evtData.event.end_date_time}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-5">No event to show</p>
          )}
        </section>
      </Suspense>
    </main>
  );
};

export default page;
