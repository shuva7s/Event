import Dp from "@/components/shared/cards/Dp";
import RemoveUser from "@/components/shared/RemoveUser";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const MembersPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id || params.id.length !== 36) {
    redirect("/");
  }

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
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'image', u.image,
        'role', mem.role
      )
    ) AS members_with_membership_type
  FROM event e
  LEFT JOIN membership m
    ON e.id = m.event_id AND m.user_id = ${userId}
  LEFT JOIN membership mem
    ON e.id = mem.event_id
  LEFT JOIN "user" u
    ON mem.user_id = u.id
  WHERE e.id = ${params.id}
  GROUP BY e.id, e.title, e.host_id, m.user_id, m.role;
`;

  const event = eventQuery[0];

  if (!event) {
    redirect("/"); // Redirect if event does not exist
  }

  console.log("event", event);

  if (!event.is_member) {
    redirect(`/events/${params.id}`);
  }

  return (
    <Suspense
      fallback={
        <main className="w-full wrapper min-h-[80vh] fl_center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      }
    >
      <main className="wrapper p_lg">
        <h1 className="h_xl text-primary my-8">{event.event_name}</h1>
        <section className="min-h-[50vh]">
          <h2 className="h_md my-4">Members</h2>
          <hr className="rounded-full my-4" />
          {event.members_with_membership_type ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.members_with_membership_type.map((request: any) => (
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
                  <div className="flex flex-row gap-1.5 flex-wrap justify-end items-center">
                    <Badge
                      variant={
                        request.role === "host" || request.role === "admin"
                          ? "default"
                          : "secondary"
                      }
                      className="py-2.5"
                    >
                      {request.role === "host" && "Host"}
                      {request.role === "admin" && "Admin"}
                      {request.role === "guest" && "Guest"}
                    </Badge>

                    {event.membership_type !== "guest" &&
                      request.role === "guest" && (
                        <RemoveUser
                          eventId={event.id}
                          targetUserId={request.id}
                          targetUserName={request.name}
                        />
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No join requests</p>
          )}
        </section>
      </main>
    </Suspense>
  );
};

export default MembersPage;
