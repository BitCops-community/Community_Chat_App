import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ConnectToDB from "@/model/db";
import MessagesModel from "@/model/MessagesModel";

const { JWT_SECRET_KEY } = process.env;
const handler = async (req: NextRequest) => {
  await ConnectToDB();

  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY!);
    const messages = await MessagesModel.find({});

    return NextResponse.json({
      success: true,
      message: "Authenticated",
      messages,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export { handler as POST };
