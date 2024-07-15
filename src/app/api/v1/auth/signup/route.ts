import { NextRequest, NextResponse } from "next/server";
import User from "@/model/UserModel";
import bcrypt from "bcrypt";
import ConnectToDB from "@/model/db";
import TempUserModel from "@/model/TempUser";
import { SendMail } from "@/model/MailSender";
import jwt from "jsonwebtoken";
const handler = async (req: NextRequest) => {
  try {
    await ConnectToDB();

    const data = await req.formData();
    const file: File | null = data.get("avatar") as unknown as File;
    const name: FormDataEntryValue | null = data.get("name");
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const cpassword = data.get("cpassword");

    if (!name || !username || !email || !password || !cpassword) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      username.toString().length < 5 ||
      password.toString().length < 5 ||
      cpassword.toString().length < 5
    ) {
      return NextResponse.json({
        success: false,
        message: "Username and password must be at least 5 characters long",
      });
    }

    if (password.toString() !== cpassword.toString()) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    let existingUser = await User.findOne({
      email: email.toString().toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }

    if (await User.findOne({ username: username.toString() })) {
      return NextResponse.json({
        success: false,
        message: "Username already exists",
      });
    }

    await TempUserModel.findOneAndDelete({ username: username.toString });
    await TempUserModel.findOneAndDelete({
      email: email.toString().toLowerCase(),
    });

    // Upload the file directly to Freeimage.host
    const uploadResponse = await uploadImageToFreeimageHost(file);

    if (!uploadResponse.success) {
      return NextResponse.json({
        success: false,
        message: "Error uploading image to Freeimage.host",
      });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    let savedUser = new TempUserModel({
      name: name.toString(),
      username: username.toString(),
      email: email.toString().toLowerCase(),
      password: hashedPassword,
      avatar: uploadResponse.url,
    });

    await savedUser.save();
    const verificationToken = jwt.sign(
      { email: email.toString().toLowerCase() },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );
    const verificationLink = `${process.env.FRONTEND_URL}/api/v1/verify?token=${verificationToken}`;
    await SendMail(email.toString(), verificationLink);

    return NextResponse.json({
      success: true,
      message: "Done! Please check your email to confirm your account.",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error uploading avatar",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const uploadImageToFreeimageHost = async (file: File) => {
  const formData = new FormData();
  formData.append("key", "6d207e02198a847aa98d0a2a901485a5");
  formData.append("action", "upload");
  formData.append("source", file);
  formData.append("format", "json");

  const response = await fetch("https://freeimage.host/api/1/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (response.ok) {
    return {
      success: true,
      url: result.image.url,
    };
  } else {
    return {
      success: false,
      message: result.error.message || "Unknown error",
    };
  }
};

export { handler as POST };
