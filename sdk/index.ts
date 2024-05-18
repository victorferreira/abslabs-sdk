export type PointIssued = {
  address: string;
  points: number;
  eventName: string;
};

export type PointsCollection =
  | {
      data: PointIssued[];
      error: undefined;
    }
  | {
      error: string;
      data: undefined;
    };

const host = process.env.NEXT_DOMAIN || "http://localhost:3000/api";

const projectCredentials = { apiKey: "", campaingId: "" };

const postTransaction = async (
  address: string,
  points: number,
  eventName: string
) => {
  const result = await fetch(`${host}/transactions`, {
    method: "POST",
    body: JSON.stringify({
      address,
      points,
      eventName,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${projectCredentials.apiKey}`,
    },
  });

  return result;
};

async function fetchTransactions(address: string, eventName?: string) {
  let path = `${host}/transactions?address=${address}`;
  if (eventName) {
    path += `&eventName=${eventName}`;
  }
  const response = await fetch(path, {
    headers: {
      Authorization: `Bearer ${projectCredentials.apiKey}`,
    },
    cache: "no-store",
    next: { revalidate: 0 },
  });

  const transactions = await response.json();
  return transactions;
}

async function distribute(
  eventName: string,
  pointsData: { points: number; address: string }
) {
  try {
    await postTransaction(pointsData.address, pointsData.points, eventName);
  } catch (error) {
    console.error("Error distributing points:", error);
    return { error: "failed to distribute points" };
  }
}

async function getPoints(address: string): Promise<PointsCollection> {
  try {
    const transactions = await fetchTransactions(address);
    return { data: transactions, error: undefined };
  } catch (error) {
    console.error("Error retrieving points:", error);
    return { error: "failed to get points", data: undefined };
  }
}

async function getPointsByAddressAndEvent(
  address: string,
  eventName: string
): Promise<PointsCollection> {
  try {
    const transactions = await fetchTransactions(address, eventName);
    return { data: transactions, error: undefined };
  } catch (error) {
    console.error("Error retrieving points by address and event:", error);
    return { error: "failed to get points", data: undefined };
  }
}

export function initialize(credentials: {
  apiKey: string;
  campaingId: string;
}) {
  if (!credentials.apiKey) throw new Error("API Key is required");

  projectCredentials.apiKey = credentials.apiKey;
  projectCredentials.campaingId = credentials.campaingId || "";

  return {
    distribute,
    getPoints,
    getPointsByAddressAndEvent,
  };
}
