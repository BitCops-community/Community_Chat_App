console.clear();
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/model/UserModel";
import dotenv from "dotenv";
import ConnectToDB from "@/model/db";
dotenv.config();
const { JWT_SECRET_KEY } = process.env;

const handler = async (req: NextRequest) => {
  // Extract cookies from request headers

  const cookie = req.headers.get("cookie");

  if (!cookie) {
    return NextResponse.json(
      { success: false, message: "No cookies found" },
      { status: 401 }
    );
  }

  // Extract the token from the cookies
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token found" },
      { status: 401 }
    );
  }

  try {
    // Verify the token
    const decodedToken: any = jwt.verify(token, JWT_SECRET_KEY!);

    // Extract user ID from the decoded token
    const userId = decodedToken?.id!;

    await ConnectToDB();
    let user: any = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let payload = {
      id: user._id.toString(),
      name: user.name,
      isAdmin: user.isAdmin,
    };

    const newToken = jwt.sign(payload, JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      success: true,
      token: newToken,
      user: {
        id: user._id!,
        name: user.name!,
        avatar: user.avatar!,
        isAdmin: user.isAdmin!,
      },
    });
  } catch (error) {
    error instanceof Error ? console.log(error.message) : console.log(error);

    // Set the cookie with an expired date to delete it
    const response = NextResponse.json(
      { success: false, message: "Invalid token", error },
      { status: 401 }
    );
    response.headers.set(
      "Set-Cookie",
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
    );
    return response;
  }
};

export { handler as POST };
