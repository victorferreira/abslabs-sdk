import {
  getTransactions,
  insertTransaction,
  getTransactionsByEvent,
} from "@/app/db";
import { NextRequest } from "next/server";
import { hash } from "node:crypto";
import { z } from "zod";

const zodSchema = z.object({
  address: z.string(),
  points: z.number().positive(),
  eventName: z.string(),
});

const requests: string[] = [];

interface RequestBody {
  address: string;
  points: number;
  eventName: string;
}

function hashRequest(body: RequestBody, userId: string): string {
  // FIXME: This is not a secure way to hash the request
  // It should consider only requests inside a small time window
  const data = `${userId}-${JSON.stringify(body)}`;
  return hash("sha256", data);
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get("userId")!;
  const address = request.nextUrl.searchParams.get("address");

  if (!address)
    return Response.json({ error: "Missing address" }, { status: 400 });

  const eventName = request.nextUrl.searchParams.get("eventName");

  if (!eventName) {
    const transactions = await getTransactions(userId, address);
    return Response.json(transactions);
  }

  const transactions = await getTransactionsByEvent(userId, address, eventName);
  return Response.json(transactions);
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("userId")!;
  const body = await request.json();
  const validatedBody = zodSchema.parse(body);
  const resquestId = hashRequest(validatedBody, userId);

  if (requests.includes(resquestId)) {
    return Response.json(
      { error: "Transaction already exists" },
      { status: 409 }
    );
  }

  await insertTransaction(validatedBody, userId);
  requests.push(resquestId);

  return Response.json({ message: "Transaction created successfully" });
}
