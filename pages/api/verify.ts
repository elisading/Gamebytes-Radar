import type { NextApiRequest, NextApiResponse } from "next";

import { PrivyClient, AuthTokenClaims } from "@privy-io/server-auth";

const PRIVY_APP_ID = "cm1qxnbc108m4pz1ujl6vwvfs";
const PRIVY_APP_SECRET = "5WQ5e9Sn9VcTyJxKfGocskLNTp8yzBCLTmN8FUShhoEygY4Egz2kova1RdUkSxdrANnDY8qVB1Q9irFaeUNqwtk9";
const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

export type AuthenticateSuccessResponse = {
  claims: AuthTokenClaims;
};

export type AuthenticationErrorResponse = {
  error: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    AuthenticateSuccessResponse | AuthenticationErrorResponse
  >,
) {
  const headerAuthToken = req.headers.authorization?.replace(/^Bearer /, "");
  const cookieAuthToken = req.cookies["privy-token"];

  const authToken = cookieAuthToken || headerAuthToken;
  if (!authToken) return res.status(401).json({ error: "Missing auth token" });

  try {
    const claims = await client.verifyAuthToken(authToken);
    return res.status(200).json({ claims });
  } catch (e: any) {
    return res.status(401).json({ error: e.message });
  }
}

export default handler;
