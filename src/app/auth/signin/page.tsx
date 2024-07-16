"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { displaySooner } from '@/components/showSonner'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/app/Context/AppContext'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import ForgotPasswordDrawer from '@/components/ForgotPasswordDrawer'

interface UserType {
    id: string;
    name: string;
    avatar: string;
    isAdmin: boolean;
}
interface responseSuccessType {
    success: boolean;
    message: string;
    user?: UserType;
    token?: string;
}



const App: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter();
    const { setLoggedIn, setToken, setUser, token, loggedIn } = useAppContext();
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            displaySooner("All fields are required")
            return
        }
        setLoading(true)
        const req = await fetch("/api/v1/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: email,
                password,
            }),
        });

        const res: responseSuccessType = await req.json();
        console.log(res);
        if (res.success) {
            setEmail("")
            setPassword("")
            setToken(res?.token!)
            setLoggedIn(true);
            setUser({
                id: res?.user?.id!,
                name: res?.user?.name!,
                avatar: res?.user?.avatar!,
                isAdmin: res?.user?.isAdmin!,
            })
            displaySooner(res.message)
            setLoading(false)
            router.push("/");
        } else {
            displaySooner(res.message)
            setLoading(false)
        }

    }

    const refreshToken = async () => {
        const req = await fetch("/api/v1/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res: { success: boolean, message: string, token?: string; user: UserType } = await req.json();

        return res;

    }

    useEffect(() => {

        if (token || loggedIn) {
            router.push("/")
        } else {
            refreshToken().then((data) => {
                if (data!.success) {
                    setToken(data!.token! || "")
                    setLoggedIn(true);
                    let userData = {
                        id: data!.user?.id!,
                        name: data!.user?.name!,
                        avatar: data!.user?.avatar!,
                        isAdmin: data!.user?.isAdmin!,
                    }
                    console.log(userData);

                    setUser(userData)
                } else {
                    console.log(data!.message);
                }
            })

        }




    }, [router, token, loggedIn, setToken, setLoggedIn, setUser]);

    return (
        <div className='h-screen flex items-center justify-center'>
            <Card className="mx-auto max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your email and password to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="button" className="w-full" disabled={loading} onClick={handleLogin}>
                            {loading ? "Logining In ..." : "Login"}
                        </Button>

                        <div className='w-full'>
                            <ForgotPasswordDrawer />
                        </div>

                        <p className="text-center text-sm flex justify-between items-center">
                            Don{"'"}t have an account? <Link href="/auth/signup" className="text-blue-500">Sign Up</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default App
