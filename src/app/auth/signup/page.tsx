"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { displaySooner } from "@/components/showSonner";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/Context/AppContext";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Page: React.FC = () => {
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null); // State to hold cropped image URL
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { token, loggedIn } = useAppContext();

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setAvatar(file);
            setAvatarURL(URL.createObjectURL(file));
        }
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            const croppedDataURL = cropper.getCroppedCanvas({ width: 400, height: 400 }).toDataURL();
            setCroppedImage(croppedDataURL); // Set cropped image URL
        }
    };

    const handleSignup = async () => {
        if (!name.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            displaySooner("Please Fill All Fields");
            return;
        }

        if (username.length < 5) {
            displaySooner("Username must be at least 5 characters long");
            return;
        }

        if (password.length < 8) {
            displaySooner("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            displaySooner("Passwords do not match");
            return;
        }

        if (!croppedImage) {
            displaySooner("Please Select a Profile Photo and Crop");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("cpassword", confirmPassword);

        if (croppedImage) {
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            formData.set("avatar", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        }

        setLoading(true);
        const req = await fetch("/api/v1/auth/signup", {
            method: "POST",
            body: formData,
        });

        const res: { success: boolean; message: string; error?: string } = await req.json();
        console.log(res);

        if (res.success) {
            displaySooner(res.message);
            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAvatar(null);
            setAvatarURL(null);
            setCroppedImage(null);
            setLoading(false);
            router.push("/auth/signin");
        } else {
            setLoading(false);
            displaySooner(res.error ? res.error : res.message);
        }
    };

    useEffect(() => {
        if (token || loggedIn) {
            router.push("/");
        }
    }, [router, token, loggedIn]);

    const cropperRef = React.useRef<any>(null);

    return (
        <div className="min-h-screen flex items-center justify-center w-100">
            <Card className="mx-auto w-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent className="w-[320px] ">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {avatarURL && !croppedImage ? (
                                <div className="mt-2 flex flex-col items-center">
                                    <Cropper
                                        src={avatarURL}
                                        style={{ height: 200, width: "100%" }}
                                        initialAspectRatio={1}
                                        aspectRatio={1}
                                        guides={false}
                                        ref={cropperRef}
                                    />
                                    <Button type="button" onClick={handleCrop} className="mt-2">
                                        Crop
                                    </Button>
                                </div>
                            ) : croppedImage ? (
                                <div className="mt-2 flex justify-center">
                                    <Image src={croppedImage} alt="Cropped Avatar" width={100} height={100} className="rounded-full" />
                                </div>
                            ) : (
                                <>
                                    <Label htmlFor="avatar">Profile Picture</Label>
                                    <input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="block w-full text-sm p-2 text-white-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                                    />
                                </>
                            )}
                        </div>
                        <div className="space-y-2 w-100">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpassword">Confirm Password</Label>
                            <Input id="cpassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <Button disabled={loading} type="button" className="w-full" onClick={handleSignup}>
                            {loading ? "Signing In ..." : "Sign Up"}
                        </Button>
                        <p className="text-center text-sm flex justify-between items-center">
                            Already have an account? <Link href="/auth/signin" className="text-blue-500">Sign In</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
