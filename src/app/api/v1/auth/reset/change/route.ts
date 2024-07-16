import User from "@/model/UserModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ForgotPasswordModel from "@/model/ForgotPasswordModel";

const handler = async (req: NextRequest) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized Request",
    });
  }

  let { password, cpassword } = await req.json();
  password.trim();
  cpassword.trim();

  // Validate password length and match
  if (password.length < 8 || cpassword.length < 8) {
    return NextResponse.json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }
  if (password !== cpassword) {
    return NextResponse.json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as any;

    const { email } = decoded;

    let forgotPasswordEntry = await ForgotPasswordModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!forgotPasswordEntry) {
      return NextResponse.json({
        success: false,
        message: "Invalid Request No Email Specified",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid Request No User Found",
      });
    }

    // Check if the password was changed within the last week
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const lastPasswordChanged = existingUser.lastPasswordChanged
      ? new Date(existingUser.lastPasswordChanged).getTime()
      : 0;
    const currentTime = Date.now();

    if (currentTime - lastPasswordChanged < oneWeekInMilliseconds) {
      return NextResponse.json({
        success: false,
        message: "You can only change your password once a week.",
      });
    }

    existingUser.password = hashedPassword;
    existingUser.lastPasswordChanged = new Date().toISOString();
    await existingUser.save();

    await ForgotPasswordModel.findOneAndDelete({
      email: email.trim().toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid token or token expired.",
    });
  }
};

export { handler as POST };
