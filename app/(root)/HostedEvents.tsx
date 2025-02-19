"use client";

import EventCard from "@/components/shared/cards/EventCard";

const HostedEvents = ({
  events,
  currentUserId,
}: {
  events: any[];
  currentUserId: string;
}) => {
  return (
    <section>
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
          <p>No events</p>
        )}
      </div>
    </section>
  );
};

export default HostedEvents;
