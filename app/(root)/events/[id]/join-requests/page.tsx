import AccRejBan from "@/components/app_components/AccRejBan";
import Dp from "@/components/app_components/cards/Dp";
import MembersAndReqsLoader from "@/components/loaders/MembersAndReqsLoader";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Renderer({ eventId }: { eventId: string }) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    redirect("/sign-in"); // Redirect to login if user is not authenticated
  }

  const userId = session.user.id;
  const sql = neon(process.env.DATABASE_URL!);

  const eventQuery = await sql`
  SELECT 
    e.id,
    e.title AS event_name,
    e.host_id,
    m.user_id IS NOT NULL AS is_member,
    COALESCE(m.role, 'guest') AS membership_type,

    json_agg(
      DISTINCT jsonb_build_object(
        'id', r_user.id,
        'name', r_user.name,
        'email', r_user.email,
        'image', r_user.image,
        'status', r.status
      )
    ) FILTER (WHERE r_user.id IS NOT NULL) AS join_requests

  FROM event e
  LEFT JOIN membership m 
    ON e.id = m.event_id AND m.user_id = ${userId}
  LEFT JOIN request r 
    ON e.id = r.event_id
  LEFT JOIN "user" r_user
    ON r.user_id = r_user.id
  WHERE e.id = ${eventId}
  GROUP BY e.id, e.title, e.host_id, m.user_id, m.role;
`;

  const event = eventQuery[0];

  if (!event) {
    redirect("/"); // Redirect if event does not exist
  }

  // console.log("event", event);

  if (!event.is_member) {
    redirect(`/events/${eventId}`);
  }

  if (event.membership_type === "guest") {
    redirect(`/events/${eventId}`);
  }
  return (
    <>
      <h1 className="h_xl text-primary my-8">{event.event_name}</h1>
      <section className="min-h-[50vh]">
        <h2 className="h_md my-4">Join requests</h2>
        <hr className="rounded-full my-4" />
        {event.join_requests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.join_requests.map((request: any) => (
              <div
                className="p-5 flex flex-col gap-5 rounded-xl border hover:shadow-md transition-all dark:hover:bg-accent/50"
                key={request.id}
              >
                <div className="flex flex-wrap flex-row gap-3">
                  <Dp
                    className="w-12 h-12"
                    expandable
                    src={request.image}
                    name={request.name}
                  />
                  <div>
                    <h2>{request.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {request.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap justify-end gap-1.5 items-center">
                  <AccRejBan
                    userId={request.id}
                    eventId={event.id}
                    isBanned={request.status === "banned"}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No join requests</p>
        )}
      </section>
    </>
  );
}

const JoinRequestsPage = ({ params }: { params: { id: string } }) => {
  if (!params.id || params.id.length !== 36) {
    redirect("/");
  }

  return (
    <main className="wrapper">
      <Suspense fallback={<MembersAndReqsLoader />}>
        <Renderer eventId={params.id} />
      </Suspense>
    </main>
  );
};

export default JoinRequestsPage;
