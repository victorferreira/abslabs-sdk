import * as sdk from "@/sdk";

const abslabsClient = sdk.initialize({
  apiKey: "process.env.NEXT_PUBLIC_API_KEY",
  campaingId: "random-event-name",
});

export default abslabsClient;
