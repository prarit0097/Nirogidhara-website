import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;

  if (!/^codex-[a-z0-9-]+\.svg$/.test(file) && !/^daily-[a-z0-9-]+\.svg$/.test(file)) {
    return new Response("Not found", { status: 404 });
  }

  const generatedRoot = join(process.cwd(), "public", "generated");
  const target = join(generatedRoot, normalize(file));

  if (!target.startsWith(generatedRoot)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const svg = await readFile(target, "utf8");
    return new Response(svg, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
