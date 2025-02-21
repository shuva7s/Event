"use client";

import EventCard from "@/components/app_components/cards/EventCard";

const MyEvents = ({
  events,
  currentUserId,
}: {
  events: any[];
  currentUserId: string;
}) => {
  return (
    <section className="min-h-[50vh]">
      <div className="columns-1 md:columns-2 lg:columns-3 space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              currentUserId={currentUserId}
              id={event.id}
              title={event.title}
              description={event.description}
              image={event.image}
              hasStarted={event.has_started}
              hasEnded={event.has_ended}
              startDateTime={event.start_date_time}
              endDateTime={event.end_date_time}
              hostId={event.host_id}
              hostName={event.host_name}
              hostImage={event.host_image}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No events to show</p>
        )}
      </div>
    </section>
  );
};

export default MyEvents;
