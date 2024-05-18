"use client";

import { useEffect, useState } from "react";
import { getIssuedPointsByAddressAndEvents } from "./actions";
import { PointIssued } from "@/sdk";

export default function Component() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [points, setPoints] = useState<
    { points: PointIssued; event: string }[]
  >([]);

  useEffect(() => {
    if (selectedEvent && selectedAddress) {
      const fetchPointsByEvent = async () => {
        const pointsByEvent = await getIssuedPointsByAddressAndEvents(
          selectedAddress,
          selectedEvent
        );
        if (pointsByEvent.data) {
          setPoints(
            pointsByEvent.data.map((points) => ({
              points,
              event: selectedEvent,
            }))
          );
        }
      };
      fetchPointsByEvent();
    }
  }, [selectedAddress, selectedEvent]);

  return (
    <div>
      <h2 className="text-xl font-bold mt-8">Points by Event</h2>

      <select onChange={(e) => setSelectedAddress(e.target.value)}>
        <option value="">Select an address</option>
        <option value="0x1234567890abcdef1234567890abcdef12345678">
          0x1234567890abcdef1234567890abcdef12345678
        </option>

        <option value="0xabcdef1234567890abcdef1234567890abcdef12">
          0xabcdef1234567890abcdef1234567890abcdef12
        </option>

        <option value="0x7890abcdef1234567890abcdef1234567890abcd">
          0x7890abcdef1234567890abcdef1234567890abcd
        </option>

        <option value="0x0123456789abcdef0123456789abcdef01234567">
          0x0123456789abcdef0123456789abcdef01234567
        </option>

        <option value="0xfedcba9876543210fedcba9876543210fedcba98">
          0xfedcba9876543210fedcba9876543210fedcba98
        </option>
      </select>

      <select onChange={(e) => setSelectedEvent(e.target.value)}>
        <option value="">Select an event</option>
        <option value="event1">Event 1</option>
        <option value="event2">Event 2</option>
        <option value="event3">Event 3</option>
      </select>

      <h3>Total Points</h3>
      <p>{points.reduce((acc, { points }) => points.points + acc, 0)}</p>
    </div>
  );
}
