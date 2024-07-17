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

  try {
    await ConnectToDB();
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    const { isAdmin, id: currentUserId } = decoded;

    if (currentUserId === userId) {
      return NextResponse.json({
        success: false,
        message: "You cannot remove yourself from admin role",
      });
    }

    let currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: "Current user not found",
      });
    }
    if (!currentUser.isAdmin) {
      return NextResponse.json({
        success: false,
        message: "Access denied (not admin)",
      });
    }

    let newUser = await User.findById(userId);
    if (!newUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid Request Invalid User!",
      });
    }
    if (
      newUser.username === "faisal_ranjha" ||
      newUser.email === "faisalshahzadyt@gmail.com" ||
      newUser.email === "ranjhaplaysyt@gmail.com"
    ) {
      return NextResponse.json({
        success: false,
        message: "You Cannot Remove this user From Admin Role",
      });
    }
    newUser.isAdmin = false;
    await newUser.save();

    return NextResponse.json({
      success: true,
      message: `Mr ${newUser?.name} Removed From Admin Role`,
    });
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
