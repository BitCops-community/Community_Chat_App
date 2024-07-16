import ConnectToDB from "@/model/db";
import { ForgotMailSender } from "@/model/ForgotMailSender";
import ForgotPasswordModel from "@/model/ForgotPasswordModel";
import User from "@/model/UserModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const handler = async (req: NextRequest) => {
  try {
    await ConnectToDB();

    const { email } = await req.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    let user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid Email! User does not exist",
      });
    }

    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const lastPasswordChanged = user.lastPasswordChanged
      ? new Date(user.lastPasswordChanged).getTime()
      : 0;
    const currentTime = Date.now();

    if (currentTime - lastPasswordChanged < oneWeekInMilliseconds) {
      const nextEligibleDate = new Date(
        lastPasswordChanged + oneWeekInMilliseconds
      );
      return NextResponse.json({
        success: false,
        message: `You can only change your password once a week. You can change it again on ${nextEligibleDate.toLocaleString()}.`,
      });
    }

    let verificationCode = Math.floor(100000 + Math.random() * 900000);

    await ForgotMailSender(user.email, verificationCode.toString());

    let encodedVerificationCode = await bcrypt.hash(
      verificationCode.toString(),
      10
    );

    await ForgotPasswordModel.findOneAndDelete({
      email: user.email.toLowerCase(),
    });

    const newEntry = new ForgotPasswordModel({
      email: user.email,
      otp: encodedVerificationCode,
    });
    await newEntry.save();

    const token = jwt.sign(
      { email: newEntry.email },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "15m",
      }
    );

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email address",
      token,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error sending verification code",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export { handler as POST };
