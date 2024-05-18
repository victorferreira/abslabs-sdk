"use server";

import { randomUUID } from "node:crypto";
import postgres from "postgres";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  //   ssl: "allow",
});

interface Transaction {
  address: string;
  points: number;
  eventName: string;
}

export async function updateApiKey(userId: string) {
  const apiKey = randomUUID();

  await sql`update users set api_key = ${apiKey} where id = ${userId}`;

  return apiKey;
}

export async function insertTransaction(
  transaction: Transaction,
  userId: string
) {
  return await sql`
      INSERT INTO transactions (address, points, previous_balance, event_name, client_id)
      VALUES (${transaction.address}, 
          ${transaction.points},
          (SELECT COALESCE(SUM(new_balance), 0) 
            FROM transactions 
            WHERE address = ${transaction.address}
            LIMIT 1),
          ${transaction.eventName},
          ${userId})`;
}

export async function getTransactions(userId: string, address: string) {
  return await sql`
          SELECT id, address, points, created_at, event_name, client_id
          FROM transactions
          WHERE client_id = ${userId}
          AND address = ${address}`;
}

export async function getTransactionsByEvent(
  userId: string,
  address: string,
  eventName: string
) {
  return await sql`
    SELECT id, address, points, created_at, event_name, client_id
    FROM transactions
    WHERE client_id = ${userId}
    AND event_name = ${eventName}
    AND address = ${address}`;
}
