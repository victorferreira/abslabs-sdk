import { NextRequest } from "next/server";
import { updateApiKey } from "@/app/db";

export async function POST(request: NextRequest) {
  const userId = request.headers.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const apiKey = updateApiKey(userId);

  return Response.json({ apiKey });
}
