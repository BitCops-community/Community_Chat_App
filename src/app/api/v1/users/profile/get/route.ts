import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/model/UserModel";
import ConnectToDB from "@/model/db";

const handler = async (req: NextRequest) => {
  const { userId } = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!userId) {
    return NextResponse.json({
      success: false,
      message: "Invalid user ID",
    });
  }

  if (!token) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized request",
    });
  }

  // Perform database operations to validate the user ID and token
  try {
    await ConnectToDB();
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const { isAdmin } = decoded;

    let userEntry = await User.findById(userId);

    if (!userEntry) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    if (isAdmin) {
      return NextResponse.json({
        success: true,
        message: "Access granted (admin)",
        user: {
          avatar: userEntry?.avatar,
          _id: userEntry?._id.toString(),
          name: userEntry?.name,
          email: userEntry?.email,
          username: userEntry?.username,
          isAdmin: userEntry?.isAdmin ? "1" : "0",
          createdAt: userEntry?.createdAt,
        },
      });
    } else {
      let safeUser = {
        avatar: userEntry?.avatar,
        name: userEntry?.name,
        createdAt: userEntry?.createdAt,
      };

      return NextResponse.json({
        success: true,
        message: "Profile Found",
        user: safeUser,
      });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Unauthorized request",
      error: error instanceof Error && error.message,
    });
  }
};

export { handler as POST };
