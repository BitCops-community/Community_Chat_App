import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
dotenv.config();
const handler = (req: NextRequest) => {
  return NextResponse.json({
    process: process.env,
  });
};

export { handler as POST, handler as GET };
