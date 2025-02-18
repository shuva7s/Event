"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { neon } from "@neondatabase/serverless";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../upstash";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "60s"),
});

export type EventData = {
  title: string;
  description: string;
  location: string;
  image: string;
  isOnline: boolean;
  isPublic: boolean;
  startDateTime: Date;
  endDateTime: Date;
  url: string;
};
export async function createEvent({
  title,
  description,
  location,
  image,
  isOnline = true,
  isPublic = true,
  startDateTime,
  endDateTime,
  url,
}: EventData) {
  try {
    const ip = headers().get("x-forwarded-for") || "unknown";
    const { remaining, limit, success } = await rateLimit.limit(ip);
    console.log("success", success);
    console.log("remaining", remaining);
    console.log("limit", limit);
    if (!success) {
      return {
        success: false,
        error: {
          title: "Rate limit exceeded",
          message: "Slow down there speedy.",
        },
      };
    }
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to create an event.",
        },
      };
    }

    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);

    const newEvent = await sql`
    INSERT INTO event (host_id, title, description, location, image, online, public, start_date_time, end_date_time, url, created_at, updated_at)
    VALUES (
      ${userId}, 
      ${title}, 
      ${description}, 
      ${location}, 
      ${image || null}, 
      ${isOnline}, 
      ${isPublic},
      ${startDateTime}, 
      ${endDateTime},
      ${url},
      NOW(), 
      NOW()
    )
    RETURNING *;
  `;

    if (newEvent.length === 0) {
      return {
        success: false,
        error: {
          title: "Unknown error",
          message: "Failed to create event.",
        },
      };
    }
    const membership = await sql`
    INSERT INTO membership (user_id, event_id, role)
    VALUES (${userId}, ${newEvent[0].id}, 'host')
    RETURNING *;
  `;

    if (membership.length === 0) {
      //delete the event
      await sql`DELETE FROM event WHERE id = ${newEvent[0].id}`;
      return {
        success: false,
        error: {
          title: "Unknown error",
          message: "Failed to create event.",
        },
      };
    }
    revalidatePath("/");
    return {
      success: true,
      id: newEvent[0].id,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Failed to create event.",
      },
    };
  }
}

export async function updateEvent({
  eventId,
  title,
  description,
  location,
  image,
  isOnline,
  isPublic,
  startDateTime,
  endDateTime,
  url,
}: EventData & { eventId: string }) {
  // TODO: add rate limit later
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to create an event.",
        },
      };
    }

    const userId = session.user.id;

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL!);

    const event = await sql`
      SELECT * FROM event
      WHERE id = ${eventId} AND host_id = ${userId}
    `;

    if (event.length === 0) {
      return {
        success: false,
        error: {
          title: "Event not found",
          message: "Failed to find event",
        },
      };
    }

    if (event[0].image !== null) {
      const oldImageKey = event[0].image.split("/").pop();
      const utapi = new UTApi();
      await utapi.deleteFiles(oldImageKey);
    }

    // Update the event in the database
    const updatedEvent = await sql`
        UPDATE event
        SET 
          title = ${title},
          description = ${description},
          location = ${location},
          image = ${image || null},
          online = ${isOnline},
          public = ${isPublic},
          start_date_time = ${startDateTime},
          end_date_time = ${endDateTime},
          url = ${url},
          updated_at = NOW()
        WHERE id = ${eventId} AND host_id = ${userId}
        RETURNING *;
      `;

    if (updatedEvent.length === 0) {
      return {
        success: false,
        error: {
          title: "Unknown error",
          message: "Failed to update event.",
        },
      };
    }

    revalidatePath("/");

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Failed to create event.",
      },
    };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to delete an event.",
        },
      };
    }

    const userId = session.user.id;

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL!);

    const permissionCheck = await sql`
    SELECT role
    FROM membership
    WHERE event_id = ${eventId} AND user_id = ${userId}
    AND role IN ('host');
  `;

    if (permissionCheck.length === 0) {
      return {
        success: false,
        error: {
          title: "Permission denied",
          message: "Only host can delete the event.",
        },
      };
    }

    // Delete the event and related data from the database
    const deletedEvent = await sql`
        DELETE FROM event
        WHERE id = ${eventId} AND host_id = ${userId}
        RETURNING *;
      `;
    if (deletedEvent.length === 0) {
      return {
        success: false,
        error: {
          title: "Unknown error",
          message: "Failed to delete event.",
        },
      };
    }
    if (deletedEvent[0].image !== null) {
      const oldImageKey = deletedEvent[0].image.split("/").pop();
      const utapi = new UTApi();
      await utapi.deleteFiles(oldImageKey);
    }
    revalidatePath("/");
    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Failed to create event.",
      },
    };
  }
}

export async function sendRequest(eventId: string) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to send a join request.",
        },
      };
    }

    const userId = session.user.id;

    const sql = neon(process.env.DATABASE_URL!);

    const newReq = await sql`
    INSERT INTO request (user_id, event_id)
    VALUES (${userId}, ${eventId})
    RETURNING *;
  `;

    if (newReq.length === 0) {
      return {
        success: false,
        error: {
          title: "Unknown error",
          message: "Failed to send request.",
        },
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        success: false,
        error: {
          title: "Request already sent",
          message: "You have already sent a request for this event.",
        },
      };
    }
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message,
      },
    };
  }
}

export async function join(eventId: string) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to join an event.",
        },
      };
    }

    const userId = session.user.id;

    const sql = neon(process.env.DATABASE_URL!);

    const newReq = await sql`
    INSERT INTO membership (user_id, event_id)
    VALUES (${userId}, ${eventId})
    RETURNING *;
  `;

    if (newReq.length === 0) {
      return {
        success: false,
        error: {
          title: "Unknown error",
          message: "Failed to join event.",
        },
      };
    }

    revalidatePath("/");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        success: false,
        error: {
          title: "Already joined",
          message: "You have already joined this event.",
        },
      };
    }
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Something went wrong",
      },
    };
  }
}

export async function handleEntry({
  eventId,
  applicantId,
  type,
}: {
  eventId: string;
  applicantId: string;
  type: "accept" | "reject" | "block" | "unblock";
}) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to do this kind of action.",
        },
      };
    }

    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);

    // Check if current user is the event host or an admin
    const permissionCheck = await sql`
      SELECT role
      FROM membership
      WHERE event_id = ${eventId} AND user_id = ${userId}
      AND role IN ('admin', 'host');
    `;

    if (permissionCheck.length === 0) {
      return {
        success: false,
        error: {
          title: "Permission denied",
          message: "You must be an admin or host to perform this action.",
        },
      };
    }

    if (type === "accept") {
      // Accept request: Add applicant to membership & remove from requests
      await sql`
        INSERT INTO membership (event_id, user_id, role)
        VALUES (${eventId}, ${applicantId}, 'guest')
        ON CONFLICT DO NOTHING;
      `;

      await sql`
        DELETE FROM request WHERE event_id = ${eventId} AND user_id = ${applicantId};
      `;

      return {
        success: true,
        message: "User has been accepted into the event.",
      };
    }

    if (type === "block") {
      // Block request: Update request status to banned
      await sql`
        UPDATE request
        SET status = 'banned'
        WHERE event_id = ${eventId} AND user_id = ${applicantId};
      `;

      return {
        success: true,
        message: "User has been blocked from joining the event.",
      };
    }

    if (type === "unblock") {
      // Unblock request: Change status back to 'pending'
      await sql`
        UPDATE request
        SET status = 'pending'
        WHERE event_id = ${eventId} AND user_id = ${applicantId} AND status = 'banned';
      `;

      return {
        success: true,
        message: "User has been unblocked and their request is pending again.",
      };
    }

    if (type === "reject") {
      // Reject request: Simply remove from requests
      await sql`
        DELETE FROM request WHERE event_id = ${eventId} AND user_id = ${applicantId};
      `;

      return {
        success: true,
        message: "User's request has been rejected.",
      };
    }

    return {
      success: false,
      error: {
        title: "Invalid action",
        message: "The provided action type is not valid.",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Something went wrong",
      },
    };
  }
}

export async function removeUser({
  eventId,
  targetUserId,
}: {
  eventId: string;
  targetUserId: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to perform this action.",
        },
      };
    }

    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);

    // Check if the current user is the host or an admin
    const permissionCheck = await sql`
      SELECT role
      FROM membership
      WHERE event_id = ${eventId} 
      AND user_id = ${userId}
      AND role IN ('admin', 'host');
    `;

    if (permissionCheck.length === 0) {
      return {
        success: false,
        error: {
          title: "Permission denied",
          message: "Only the event host or an admin can remove users.",
        },
      };
    }

    // Check if the target user is an admin or host (prevent self-removal of hosts)
    const targetUserCheck = await sql`
      SELECT role
      FROM membership
      WHERE event_id = ${eventId} 
      AND user_id = ${targetUserId};
    `;

    if (targetUserCheck.length === 0) {
      return {
        success: false,
        error: {
          title: "User not found",
          message:
            "The user you are trying to remove is not part of this event.",
        },
      };
    }

    if (targetUserCheck[0].role === "host") {
      return {
        success: false,
        error: {
          title: "Cannot remove host",
          message: "The event host cannot be removed.",
        },
      };
    }

    // Remove the user from the event
    await sql`
      DELETE FROM membership 
      WHERE event_id = ${eventId} AND user_id = ${targetUserId};
    `;

    return {
      success: true,
      message: "User has been removed from the event.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Something went wrong",
      },
    };
  }
}

export async function handleStartEnd({
  eventId,
  type,
}: {
  eventId: string;
  type: "start" | "end";
}) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session) {
      return {
        success: false,
        error: {
          title: "You are not signed in",
          message: "You must be logged in to perform this action.",
        },
      };
    }

    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);

    // Check if current user is the event host or an admin
    const permissionCheck = await sql`
      SELECT role
      FROM membership
      WHERE event_id = ${eventId} AND user_id = ${userId}
      AND role IN ('admin', 'host');
    `;

    if (permissionCheck.length === 0) {
      return {
        success: false,
        error: {
          title: "Permission denied",
          message: "You must be an admin or host to perform this action.",
        },
      };
    }

    if (type === "start") {
      // Start event: Set `has_started` to TRUE
      await sql`
        UPDATE event
        SET has_started = TRUE
        WHERE id = ${eventId} AND has_started = FALSE;
      `;

      return {
        success: true,
        message: "Event has started successfully.",
      };
    }

    if (type === "end") {
      // End event: Set `has_ended` to TRUE
      await sql`
        UPDATE event
        SET has_ended = TRUE
        WHERE id = ${eventId} AND has_ended = FALSE;
      `;

      return {
        success: true,
        message: "Event has ended successfully.",
      };
    }

    return {
      success: false,
      error: {
        title: "Invalid action",
        message: "The provided action type is not valid.",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        title: "Unknown error",
        message: error.message || "Something went wrong",
      },
    };
  }
}
