import ForgotPasswordModel from "@/model/ForgotPasswordModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface JwtPayloadType extends JwtPayload {
  email: string;
}

const handler = async (req: NextRequest) => {
  const { otp } = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized Request!",
    });
  }

  if (!otp || otp.length !== 6) {
    return NextResponse.json({
      success: false,
      message: "Invalid OTP",
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const { email } = decoded;

    const forgotPasswordEntry = await ForgotPasswordModel.findOne({
      email: email.toLowerCase(),
    });

    if (!forgotPasswordEntry) {
      return NextResponse.json({
        success: false,
        message: "Invalid Email Address! User Does Not Exist",
      });
    }

    const isCorrectOtp = await bcrypt.compare(otp, forgotPasswordEntry.otp);

    if (!isCorrectOtp) {
      // Reduce remainingTries by 1
      forgotPasswordEntry.remainingTries -= 1;
      if (forgotPasswordEntry.remainingTries <= 0) {
        await ForgotPasswordModel.deleteOne({ email: email.toLowerCase() });
        return NextResponse.json({
          success: false,
          message:
            "Invalid OTP. You have no tries remaining. Please request a new OTP.",
        });
      } else {
        await forgotPasswordEntry.save();
        return NextResponse.json({
          success: false,
          message: `Invalid OTP. You have ${forgotPasswordEntry.remainingTries} tries remaining.`,
        });
      }
    }

    // Generate a new token for the change password process
    const newToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "15m", // Token valid for 15 minutes
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully. Proceed to change password.",
      token: newToken,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid OTP or Token Expired",
    });
  }
};

export { handler as POST };
