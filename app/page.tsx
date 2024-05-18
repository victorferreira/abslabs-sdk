import { issueRandomPoints, getIssuedPoints } from "./actions";
import PointsByEvents from "./points-event";

export default async function Page() {
  const pointsByAddress = await getIssuedPoints();
  return (
    <div className="bg-white p-8 rounded shadow-md w-full min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Distribute Points</h1>
      <form action={issueRandomPoints}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          type="submit"
        >
          Generate Random Transaction
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mt-8">Points by Address</h2>
        <ul className="list-disc pl-8 mt-4">
          {pointsByAddress.map(({ address, points }) => (
            <li key={address}>
              {address}:
              {Array.isArray(points) ? (
                points.reduce((acc: any, { points }: any) => acc + points, 0)
              ) : (
                <span>No points available.</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <PointsByEvents />
    </div>
  );
}
