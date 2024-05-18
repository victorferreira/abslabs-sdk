// function authorizeRequest() {
//     return async (request: NextRequest) => {
//       const credentials = request.headers.get("Authorization");
//       if (!credentials) {
//         return Response.json({ error: "Missing credentials" }, { status: 401 });
//       }
//       const apiKey = credentials.replace("Bearer ", "");
//       const userId = getUserIdFromApiKey(apiKey);
//       if (!userId) {
//         return Response.json({ error: "Invalid credentials" }, { status: 401 });
//       }
//       return request;
//     };

import { NextRequest, NextResponse } from "next/server";

//   }
interface User {
  id: string;
  apiKey: string;
}

const users: User[] = [
  { id: "02379403-4B8B-47F8-9B23-C4D173334F1C", apiKey: "api_key_1" },
  {
    id: "10D4730F-CEFC-49AD-A30E-710EEE086A49",
    apiKey: "process.env.NEXT_PUBLIC_API_KEY",
  },
  { id: "E0368F89-E71B-4E2F-99E9-DBD3DDAD7075", apiKey: "api_key_3" },
];

function getUserIdFromApiKey(apiKey: string) {
  const user = users.find((user) => user.apiKey === apiKey);
  return user?.id;
}

export function middleware(request: NextRequest) {
  const credentials = request.headers.get("Authorization");
  if (!credentials) {
    return Response.json({ error: "Missing credentials" }, { status: 401 });
  }
  const apiKey = credentials.replace("Bearer ", "");
  const userId = getUserIdFromApiKey(apiKey);
  if (!userId) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", userId);

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: "/api/transactions/:path*",
};
