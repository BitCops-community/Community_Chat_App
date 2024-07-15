"use client"
import { useAppContext } from '@/app/Context/AppContext';
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Logout() {
    const router = useRouter();
    const { setLoggedIn, setToken, setUser } = useAppContext()
    const logout = async () => {
        const req = await fetch("/api/v1/auth/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const res = await req.json();
        if (res.success) {
            setToken("");
            setUser(null);
            setLoggedIn(false);
            router.push("/auth/signin")
        }
    }



    return (
        <div>
            <LogOut className='cursor-pointer' size={20} onClick={logout} />
        </div>
    )
}
