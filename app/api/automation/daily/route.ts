import { generateDailyContent } from "../../../../lib/generator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const supplied = request.headers.get("x-cron-secret");
    if (supplied !== expected) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  return Response.json(await generateDailyContent());
}

export async function GET() {
  return Response.json({ ok: true, schedule: "06:00 Asia/Kolkata", endpoint: "POST /api/automation/daily" });
}
