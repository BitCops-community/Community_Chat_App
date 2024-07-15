import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import User from "@/model/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ConnectToDB from "@/model/db";
import TempUserModel from "@/model/TempUser";
import { SendMail } from "@/model/MailSender";

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

    await TempUserModel.findOneAndDelete({
      username: username.toString(),
    });

    await TempUserModel.findOneAndDelete({
      email: email.toString().toLowerCase(),
    });

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

    const savedFile: { success: boolean; fileName?: string } = await saveAvatar(
      file
    );

    if (!savedFile.success) {
      return NextResponse.json({
        success: false,
        message: "Error saving Profile Picture",
      });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Generate a verification token
    const verificationToken = jwt.sign(
      { email: email.toString().toLowerCase() },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    let savedUser = new TempUserModel({
      name: name.toString(),
      username: username.toString(),
      email: email.toString().toLowerCase(),
      password: hashedPassword,
      avatar: `/uploads/${savedFile.fileName}`,
      verificationToken: verificationToken,
    });

    await savedUser.save();

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/api/v1/verify?token=${verificationToken}`;
    await SendMail(email.toString(), verificationLink);

    return NextResponse.json({
      success: true,
      message:
        "Welcome aboard! Your account has been created successfully. Please verify your email.",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error uploading avatar",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const saveAvatar = async (file: File) => {
  if (!file) {
    return { success: false };
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}_${Math.floor(Math.random() * 999999999999)}_${
    file.name
  }`;
  const newPath = path.join(process.cwd(), "public", "uploads", fileName);
  await fs.writeFile(newPath, buffer);
  return { success: true, fileName: fileName };
};

export { handler as POST };
