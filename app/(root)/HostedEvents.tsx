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
              event={event}
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
