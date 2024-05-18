"use server";

import { randomUUID } from "node:crypto";
import { sql } from "@vercel/postgres";

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
  const result = await sql`
      INSERT INTO transactions (address, points, previous_balance, event_name, client_id)
      VALUES (${transaction.address}, 
          ${transaction.points},
          (SELECT COALESCE(SUM(new_balance), 0) 
            FROM transactions 
            WHERE address = ${transaction.address}
            LIMIT 1),
          ${transaction.eventName},
          ${userId})`;
  return result.rows;
}

export async function getTransactions(userId: string, address: string) {
  const result = await sql`
          SELECT id, address, points, created_at, event_name, client_id
          FROM transactions
          WHERE client_id = ${userId}
          AND address = ${address}`;
  return result.rows;
}

export async function getTransactionsByEvent(
  userId: string,
  address: string,
  eventName: string
) {
  const result = await sql`
    SELECT id, address, points, created_at, event_name, client_id
    FROM transactions
    WHERE client_id = ${userId}
    AND event_name = ${eventName}
    AND address = ${address}`;
  return result.rows;
}
