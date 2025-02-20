import EventForm from "@/components/app_components/forms/EventForm";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const EditEventPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id || params.id.length !== 36) {
    redirect(`/`);
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
    e.*, 
    m.user_id IS NOT NULL AS is_member,
    m.role AS membership_type,
    mr.user_id IS NOT NULL AS has_requested
  FROM event e
  LEFT JOIN membership m 
    ON e.id = m.event_id AND m.user_id = ${userId}
  LEFT JOIN request mr 
    ON e.id = mr.event_id AND mr.user_id = ${userId}
  WHERE e.id = ${params.id}
  LIMIT 1;
`;

  const event = eventQuery[0];

  if (!event) {
    redirect("/"); // Redirect if event does not exist
  }

  if (event.membership_type !== "host") {
    redirect("/");
  }

  return (
    <main className="wrapper min-h-[85vh]">
      <h1 className="h_xl mt-5 mb-10">
        Update <span className="text-primary">event</span>
      </h1>
      <Suspense
        fallback={
          <div className="w-full wrapper min-h-[80vh] fl_center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <EventForm
          type="update"
          eventId={event.id}
          title={event.title}
          description={event.description}
          image={event.image}
          isOnline={event.online}
          isPublic={event.public}
          location={event.location}
          startDateTime={new Date(event.start_date_time)}
          endDateTime={new Date(event.end_date_time)}
          hasStarted={event.has_started}
          hasEnded={event.has_ended}
          url={event.url}
        />
      </Suspense>
    </main>
  );
};

export default EditEventPage;
