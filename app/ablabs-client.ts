import { initialize } from "@/sdk";

const abslabsClient = initialize({
  apiKey: "process.env.NEXT_PUBLIC_API_KEY",
  campaingId: "random-event-name",
});

export default abslabsClient;
