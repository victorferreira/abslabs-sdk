# README

## App

The app section contains the an application code to serve as an example. It has a button to generata a random transaction, a section do display the transactions aggregated by addresses, and a form to filter transaction by address and event. It uses the SDK to communicate with the API.

## SDK

The SDK module bridges the gap between the app and the API. You can initialize the SDK using a an API_Key. To request an API Key send a POST request to `/api/keys`.

```curl --header 'userId: 4e8f6671-6297-4625-a4e6-1daf581e4ba6' --request POST http://localhost:3000/api/keys```

```ts
import { initalize } from "abslabs-sdk-test";

const abslabsClient = initialize({
  apiKey: "process.env.NEXT_PUBLIC_API_KEY",
  campaingId: "random-event-name",
});
```

Once the SDK is initialized, you can use the client to issue points to an address and fetch points issued from and address. You can also filter transactions by eventName.


## API

The API is built using a single PostgreSQL database for all transaction data. This approach ensures efficiency in updating and querying the database without needing JOINS. This structure could be replicated using a key-value store, like Redis or DynamoDB, on possible future migration. 

Using Postgres allows the API to track the balance over time with a single INSERT statement.  Implementing this on a traditional key-value store would require the service to fetch the latest transaction, calculate the new balance, and store all changes in the database while ensuring data consistency. Even if the service performs these tasks correctly, concurrent requests could produce an inconsistent balance, which can be difficult to track.