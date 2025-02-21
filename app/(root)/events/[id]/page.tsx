import DeleteEvent from "@/components/app_components/DeleteEvent";
import EndEvent from "@/components/app_components/EndEvent";
import Join from "@/components/app_components/Join";
import SendRequest from "@/components/app_components/SendRequest";
import StartEvent from "@/components/app_components/StartEvent";
import TimeRemaining from "@/components/app_components/TimeRemaining";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { ImageIcon, UserPlus2, Users2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const EventPage = async ({ params }: { params: { id: string } }) => {
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

  // console.log(event);

  if (!event) {
    redirect("/"); // Redirect if event does not exist
  }

  return (
    <main className="wrapper">
      <section className="grid gap-5 md:gap-10 grid-cols-1 md:grid-cols-2">
        <div className="rounded-2xl w-full bg-accent overflow-hidden flex fl_center aspect-square max-h-[600px] md:sticky top-10">
          {event.image ? (
            <Image
              className="w-full h-full select-none object-cover"
              src={event.image}
              width={300}
              height={300}
              alt={event.title}
              quality={80}
              loading="lazy"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-3 mb-5">
          <h1 className="h_xl md:mt-3">{event.title}</h1>
          <p className="p_lg text-muted-foreground">{event.description}</p>
          <div className="flex flex-col gap-5">
            <TimeRemaining
              className="flex-1 py-2.5"
              startDateTime={event.start_date_time}
              endDateTime={event.end_date_time}
              hasStarted={event.has_started}
              hasEnded={event.has_ended}
            />
            {event.is_member ? (
              <>
                {event.host_id === session.user.id ? (
                  <div className="flex flex-row gap-2 flex-wrap justify-end items-center">
                    {event.has_started && event.has_ended ? (
                      <DeleteEvent
                        eventId={event.id}
                        hasEnded={event.has_ended}
                        hasStarted={event.has_started}
                      />
                    ) : (
                      <>
                        {!event.has_started && !event.has_ended && (
                          <StartEvent
                            eventId={event.id}
                            startDateTime={event.start_date_time}
                          />
                        )}
                        {event.has_started && !event.has_ended && (
                          <EndEvent eventId={event.id} />
                        )}
                        <Button variant="secondary" asChild>
                          <Link href={`/events/${params.id}/update`}>Edit</Link>
                        </Button>
                        <DeleteEvent
                          eventId={event.id}
                          hasEnded={event.has_ended}
                          hasStarted={event.has_started}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <Button variant="destructive">Leave</Button>
                )}

                {event.location && (
                  <div className="p-5 bg-accent dark:bg-accent/50 dark:hover:bg-accent/80 transition-colors rounded-2xl text-muted-foreground">
                    <span className="text-foreground">Location: </span>
                    {event.location}
                  </div>
                )}
                {event.url && (
                  <div className="py-3 px-5 bg-accent dark:bg-accent/50 dark:hover:bg-accent/80 transition-colors rounded-full text-nowrap overflow-hidden">
                    <span className="text-foreground">Meeting link: </span>
                    <Link
                      target="_blank"
                      className="text-primary"
                      href={event.url}
                    >
                      {event.url}
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                {event.public ? (
                  <Join eventId={event.id} />
                ) : (
                  <SendRequest
                    requested={event.has_requested}
                    eventId={event.id}
                  />
                )}
              </>
            )}
          </div>
          {event.is_member && (
            <>
              <hr className="rounded-full my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link
                  href={`/events/${params.id}/members`}
                  className="p-5 border rounded-xl flex flex-col gap-3 hover:shadow-md dark:hover:bg-accent/50 transition-all"
                >
                  <div className="h-16 w-16 rounded-full fl_center bg-primary text-white">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <p className="p_md">Members</p>
                </Link>

                {event.membership_type === "admin" ||
                  (event.membership_type === "host" && (
                    <Link
                      href={`/events/${params.id}/join-requests`}
                      className="p-5 border rounded-xl flex flex-col gap-3 hover:shadow-md dark:hover:bg-accent/50 transition-all"
                    >
                      <div className="h-16 w-16 rounded-full fl_center bg-primary text-white">
                        <UserPlus2 className="w-5 h-5" />
                      </div>
                      <p className="p_md">Join requests</p>
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default EventPage;
