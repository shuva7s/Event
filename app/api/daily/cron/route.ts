// import { neon } from "@neondatabase/serverless";
// import { NextRequest } from "next/server";

// export async function GET(request: NextRequest) {
//   // Check authorization header
//   const authHeader = request.headers.get("authorization");
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const sql = neon(process.env.DATABASE_URL!);

//   try {
//     await sql`
//       DELETE FROM event
//       WHERE has_ended = true
//       OR (end_date_time < NOW() AND has_started = false);
//     `;

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Expired events have been cleaned up.",
//       }),
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message || "An error occurred while cleaning up events.",
//       }),
//       { status: 500 }
//     );
//   }
// }

import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET(request: NextRequest) {
  // Check authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const expiredEvents = await sql`
      SELECT id, image FROM event
      WHERE has_ended = true 
      OR (end_date_time < NOW() AND has_started = false);
    `;

    // 2️⃣ **Extract image URLs & IDs of events**
    const imagesToDelete: string[] = expiredEvents
      .filter((event) => event.image !== null)
      .map((event) => event.image as string); // Cast to string to avoid TypeScript error

    const eventIdsToDelete: string[] = expiredEvents.map((event) => event.id);

    if (imagesToDelete.length > 0) {
      const utapi = new UTApi();
      await utapi.deleteFiles(imagesToDelete);
    }

    // 3️⃣ **Delete events from the database**
    if (eventIdsToDelete.length > 0) {
      await sql`
        DELETE FROM event WHERE id = ANY(${eventIdsToDelete});
      `;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Expired events and associated images (if any) have been cleaned up.",
        deletedImages: imagesToDelete,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred while cleaning up events.",
      }),
      { status: 500 }
    );
  }
}
