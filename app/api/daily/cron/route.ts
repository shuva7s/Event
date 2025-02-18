import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Check authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Delete events that are either marked as ended or have passed their end time without starting
    await sql`
      DELETE FROM event
      WHERE has_ended = true 
      OR (end_date_time < NOW() AND has_started = false);
    `;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Expired events have been cleaned up.",
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
