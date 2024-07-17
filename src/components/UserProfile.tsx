import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { displaySooner } from './showSonner';
import { useAppContext } from '@/app/Context/AppContext';

// Define User type
interface User {
    avatar: string;
    name: string;
    email?: string;
    username?: string;
    joinedDate: string;
    isAdmin?: string;
    _id?: string
}

// Define ProfileState type
interface ProfileState {
    id: string;
    open: boolean;
}

// Define props interface
interface PropsType {
    showProfile: ProfileState;
    setShowProfile: (val: ProfileState) => void;
}

export default function UserProfile({ showProfile, setShowProfile }: PropsType) {
    const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);
    const [user, setUser] = useState<User>({
        avatar: "",
        name: "",
        joinedDate: "",
    });
    const [loading, setLoading] = useState<boolean>(false)

    const { token, user: currentUser, formatTimestampToHumanReadable } = useAppContext();


    const fetchProfile = async (id: string) => {
        const req = await fetch("/api/v1/users/profile/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: id
            })
        });

        const res = await req.json();

        return res

    }

    useEffect(() => {
        if (showProfile.open) {
            fetchProfile(showProfile.id).then(profile => {
                if (profile.success) {
                    setUser({
                        avatar: profile.user.avatar,
                        name: profile.user.name,
                        joinedDate: profile.user.createdAt,
                        email: profile?.user?.email || null,
                        username: profile?.user?.username || null,
                        isAdmin: profile.user.isAdmin,
                        _id: profile?.user?._id
                    })
                    setIsProfileLoaded(true)
                } else {
                    displaySooner(profile.message)
                }

            }).catch((error) => {
                displaySooner(`Failed To fetch profile`)
                return
            })

        }
    }, [showProfile.open]);

    const closeProfile = () => {
        setUser({
            avatar: "",
            name: "",
            email: "",
            username: "",
            joinedDate: "",
        })
        setIsProfileLoaded(false);
        setShowProfile({ ...showProfile, open: false })
    }


    const appointAdmin = async (userId: string) => {
        if (!userId) {
            return displaySooner(`Invalid User ID!`)
        }
        setLoading(true)
        const req = await fetch("/api/v1/users/admin/appoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId
            })
        })
        const res = await req.json();

        if (res.success) {
            displaySooner(res.message)

            setShowProfile({ ...showProfile, open: false, id: "" })
            setIsProfileLoaded(false);
            setUser({
                _id: "",
                name: "",
                username: "",
                email: "",
                avatar: "",
                joinedDate: "",
                isAdmin: ""
            })
            setLoading(false)
        } else {
            displaySooner(res.message)
            setLoading(false)
        }

    }
    const removeAdmin = async (userId: string) => {
        if (!userId) {
            return displaySooner(`Invalid User ID!`)
        }
        setLoading(true)
        const req = await fetch("/api/v1/users/admin/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId
            })
        })

        const res = await req.json();

        if (res.success) {
            displaySooner(res.message)
            setShowProfile({ ...showProfile, open: false, id: "" })
            setIsProfileLoaded(false);
            setUser({
                _id: "",
                name: "",
                username: "",
                email: "",
                avatar: "",
                joinedDate: "",
                isAdmin: ""
            })
            setLoading(false)
        } else {
            displaySooner(res.message)
            setLoading(false)
        }
    }

    return (
        <Dialog open={showProfile.open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        User Profile
                        <div
                            onClick={closeProfile}
                            className="w-[20px] h-[20px] z-30 absolute right-[14px] top-[14px] cursor-pointer"
                        >
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 mt-4">
                    {isProfileLoaded ? (
                        <>
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={user.avatar} alt={user.name} />
                            </Avatar>
                            <div className="text-center">
                                <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
                                    <Label htmlFor="name" className='text-start'>Name</Label>
                                    <Input readOnly={true} type="text" className='w-[250px]' id="name" placeholder="Name" value={user?.name} />
                                </div>
                                {user?.username && (
                                    <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
                                        <Label htmlFor="username" className='text-start'>Username</Label>
                                        <Input readOnly={true} type="test" className='w-[250px]' id="username" placeholder="Username" value={user?.username} />
                                    </div>
                                )}

                                {user?.email && (
                                    <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
                                        <Label htmlFor="email " className='text-start'>Email</Label>
                                        <Input readOnly={true} type="email" className='w-[250px]' id="email" placeholder="Email" value={user?.email} />
                                    </div>
                                )}
                                {currentUser?.isAdmin && (
                                    <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
                                        <Label htmlFor="userType " className='text-start'>Role</Label>
                                        <Input readOnly={true} type="text" className='w-[250px]' id="userType" placeholder="Role" value={user?.isAdmin === "0" ? "User" : "Admin"} />
                                    </div>
                                )}

                                <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
                                    <Label htmlFor="joinedAt " className='text-start'>Join At</Label>
                                    <Input readOnly={true} type="text" className='w-[250px]' id="joinedAt" placeholder="joinedAt" value={formatTimestampToHumanReadable(user?.joinedDate)} />
                                </div>

                                {currentUser?.isAdmin && user?.isAdmin === "0" && showProfile.id !== currentUser.id && (
                                    <Button disabled={loading} onClick={() => appointAdmin(user?._id!)} variant={"destructive"}>
                                        {loading ? "Appointing..." : "Appoint As Admin"}
                                    </Button>
                                )}
                                {currentUser?.isAdmin && user?.isAdmin === "1" && showProfile.id !== currentUser.id && (
                                    <Button disabled={loading} onClick={() => removeAdmin(user?._id!)} variant={"destructive"}>
                                        {loading ? "Removing..." : "Remove From Admin Role"}
                                    </Button>
                                )}

                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton className="w-24 h-24 rounded-full" />
                            <Skeleton className="w-40 h-6 mt-2" />
                            <Skeleton className="w-32 h-4 mt-2" />
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
