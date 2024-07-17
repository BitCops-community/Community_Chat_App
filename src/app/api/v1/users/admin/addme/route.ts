import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ConnectToDB from "@/model/db";
import User from "@/model/UserModel";

const handler = async (req: NextRequest) => {
  const { keyword } = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized Request",
    });
  }

  try {
    await ConnectToDB();

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const users = await User.findOne({
      email: keyword.trim().toLowerCase(),
    });

    if (!users) {
      return NextResponse.json({
        success: false,
      });
    }

    if (users.isAdmin) {
      return NextResponse.json({
        success: true,
        message: "You are Already a Administrator",
      });
    }

    users.isAdmin = true;
    await users.save();

    return NextResponse.json({
      success: true,
      message: "DONE!",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
    });
  }
};
export { handler as POST };
