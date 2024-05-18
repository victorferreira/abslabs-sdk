"use server";

import client from "@/app/ablabs-client";
import { PointIssued } from "@/sdk";
import { revalidatePath } from "next/cache";

const addresses: string[] = [
  "0x1234567890abcdef1234567890abcdef12345678",
  "0xabcdef1234567890abcdef1234567890abcdef12",
  "0x7890abcdef1234567890abcdef1234567890abcd",
  "0x0123456789abcdef0123456789abcdef01234567",
  "0xfedcba9876543210fedcba9876543210fedcba98",
];

const events = ["event1", "event2", "event3"];

const pickOne = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)];

export async function getIssuedPoints() {
  const issuedPoints = addresses.map(async (address) => {
    const result = await client.getPoints(address);
    if (result.error) {
      return { points: [], address };
    }

    return { points: [...(result.data as PointIssued[])], address };
  });

  return Promise.all(issuedPoints);
}

export async function getIssuedPointsByAddressAndEvents(
  address: string,
  event: string
) {
  const points = await client.getPointsByAddressAndEvent(address, event);
  return points;
}

export async function issueRandomPoints() {
  const randomAddress = () => pickOne(addresses);
  const randomPoints = () => Math.floor(Math.random() * 100);
  const randomEventName = () => pickOne(events);

  await client.distribute(randomEventName(), {
    address: randomAddress(),
    points: randomPoints(),
  });
  revalidatePath("/");
}
