export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import ConnectToDB from "@/model/db";
import TempUserModel from "@/model/TempUser";
import User from "@/model/UserModel";

interface PayloadType extends JwtPayload {
  email: string;
}

const verifyHandler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const token: string | null = req.url.split("?")[1].split("=")[1];

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
      });
    }
    await ConnectToDB();

    let decoded: PayloadType;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as PayloadType;
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    const tempUser = await TempUserModel.findOne({ email: decoded.email });
    if (!tempUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const newUser = new User({
      name: tempUser.name,
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      avatar: tempUser.avatar,
    });

    await newUser.save();

    await TempUserModel.findOneAndDelete({ email: decoded.email });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! Please Continue To Login",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error verifying email",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export { verifyHandler as GET };
