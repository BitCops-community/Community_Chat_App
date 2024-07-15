import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Set the 'token' cookie to expire in the past to delete it
  response.headers.set(
    "Set-Cookie",
    "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
  );

  return response;
};

export { handler as POST, handler as GET };
