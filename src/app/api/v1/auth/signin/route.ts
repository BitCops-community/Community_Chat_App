import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
dotenv.config();
import ConnectToDB from "@/model/db";
import User from "@/model/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface credentialsType {
  login: string;
  password: string;
}

const { JWT_SECRET_KEY } = process.env;

const handler = async (req: NextRequest) => {
  try {
    await ConnectToDB();

    // Extract credentials from request body
    const { login, password }: credentialsType = await req.json();

    if (login.length < 4 || password.length < 6) {
      return NextResponse.json({
        success: false,
        message:
          "Invalid credentials! Username and password must be at least 4 and 6 characters long respectively",
      });
    }

    // Check if credentials are valid

    let user = await User.findOne({ email: login });

    if (!user)
      return NextResponse.json({
        success: false,
        message: "Invalid credentials! Please try again",
      });

    let isMatchedPassword = await bcrypt.compare(password, user.password);

    if (isMatchedPassword) {
      const payload = {
        id: user._id.toString(),
        name: user.name,
        isAdmin: user.isAdmin,
      };

      const token = jwt.sign(payload, JWT_SECRET_KEY!, {
        expiresIn: "1h",
      });

      let securePublicDetails = {
        id: user._id.toString(),
        avatar: user.avatar,
        name: user.name,
        isAdmin: user.isAdmin,
      };

      const response = NextResponse.json({
        success: true,
        message: "Login successful!",
        user: securePublicDetails,
        token,
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60,
        path: "/",
        sameSite: "strict",
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      message: "Invalid credentials! Please try again",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing your request",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export { handler as POST };
