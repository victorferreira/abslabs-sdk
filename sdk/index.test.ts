import { expect, describe, it, vi, beforeEach } from "vitest";
import { initialize } from "./index";

global.fetch = vi.fn();

function createFetchResponse(data: unknown) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}

describe("initialize", () => {
  it("should throw an error if API Key is not provided", () => {
    expect(() => {
      // @ts-ignore
      initialize({ apiKey: "" });
    }).toThrowError("API Key is required");
  });

  it("should return an object with distribute, getPoints, and getPointsByAddressAndEvent functions", () => {
    const sdk = initialize({ apiKey: "API_KEY", campaingId: "CAMPAIGN_ID" });

    expect(sdk).toHaveProperty("distribute");
    expect(sdk).toHaveProperty("getPoints");
    expect(sdk).toHaveProperty("getPointsByAddressAndEvent");
    expect(typeof sdk.distribute).toBe("function");
    expect(typeof sdk.getPoints).toBe("function");
    expect(typeof sdk.getPointsByAddressAndEvent).toBe("function");
  });
});

describe("distribute", () => {
  const client = initialize({ apiKey: "API_KEY", campaingId: "CAMPAIGN_ID" });
  beforeEach(() => {
    // @ts-ignore
    global.fetch.mockReset();
  });

  it("should distribute points successfully", async () => {
    const eventName = "Test Event";
    const pointsData = { points: 100, address: "example_address" };
    const mockResponse = { message: "Transaction created successfully" };

    // @ts-ignore
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    await client.distribute(eventName, pointsData);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions",
      {
        method: "POST",
        body: JSON.stringify({
          address: pointsData.address,
          points: pointsData.points,
          eventName,
        }),
        headers: {
          Authorization: `Bearer API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );
  });

  it("should handle errors when distributing points", async () => {
    const eventName = "Test Event";
    const pointsData = { points: 100, address: "example_address" };

    // Mock the postTransaction function to throw an error
    const mockPostTransaction = vi.fn();
    mockPostTransaction.mockRejectedValue({
      error: "failed to distribute points",
    });
    vi.spyOn(global, "fetch").mockImplementation(mockPostTransaction);

    const result = await client.distribute(eventName, pointsData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions",
      {
        method: "POST",
        body: JSON.stringify({
          address: pointsData.address,
          points: pointsData.points,
          eventName,
        }),
        headers: {
          Authorization: `Bearer API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );
    expect(result).toEqual({ error: "failed to distribute points" });
  });
});

describe("getPoints", () => {
  const client = initialize({ apiKey: "API_KEY", campaingId: "CAMPAIGN_ID" });
  beforeEach(() => {
    // @ts-ignore
    global.fetch.mockReset();
  });

  it("should fetch transactions successfully", async () => {
    const address = "example_address";
    const mockResponse = [
      { address: "example_address", points: 100, eventName: "Test Event" },
    ];

    // @ts-ignore
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const result = await client.getPoints(address);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions?address=example_address",
      {
        headers: {
          Authorization: `Bearer API_KEY`,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    expect(result).toEqual({
      data: [
        { address: "example_address", points: 100, eventName: "Test Event" },
      ],
      error: undefined,
    });
  });

  it("should handle errors when fetching transactions", async () => {
    const address = "example_address";

    // Mock the fetchTransactions function to throw an error
    const mockFetchTransactions = vi.fn();
    mockFetchTransactions.mockRejectedValue({
      error: "failed to get points",
    });
    vi.spyOn(global, "fetch").mockImplementation(mockFetchTransactions);

    const result = await client.getPoints(address);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions?address=example_address",
      {
        headers: {
          Authorization: `Bearer API_KEY`,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    expect(result).toEqual({ error: "failed to get points", data: undefined });
  });
});

describe("getPointsByAddressAndEvent", () => {
  const client = initialize({ apiKey: "API_KEY", campaingId: "CAMPAIGN_ID" });
  beforeEach(() => {
    // @ts-ignore
    global.fetch.mockReset();
  });

  it("should fetch transactions successfully by address and event", async () => {
    const address = "example_address";
    const eventName = "TestEvent";
    const mockResponse = [
      { address: "example_address", points: 100, eventName: "Test Event" },
    ];

    // @ts-ignore
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const result = await client.getPointsByAddressAndEvent(address, eventName);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions?address=example_address&eventName=TestEvent",
      {
        headers: {
          Authorization: `Bearer API_KEY`,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    expect(result).toEqual({
      data: [
        { address: "example_address", points: 100, eventName: "Test Event" },
      ],
      error: undefined,
    });
  });

  it("should handle errors when fetching transactions by address and event", async () => {
    const address = "example_address";
    const eventName = "TestEvent";

    // Mock the fetchTransactions function to throw an error
    const mockFetchTransactions = vi.fn();
    mockFetchTransactions.mockRejectedValue({
      error: "failed to get points",
    });
    vi.spyOn(global, "fetch").mockImplementation(mockFetchTransactions);

    const result = await client.getPointsByAddressAndEvent(address, eventName);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/transactions?address=example_address&eventName=TestEvent",
      {
        headers: {
          Authorization: `Bearer API_KEY`,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    expect(result).toEqual({ error: "failed to get points", data: undefined });
  });
});
