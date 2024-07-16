"use client";
import React, { useState } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from './ui/button';
import ForgotPasswordEmail from './ForgotPasswordEmail';
import ForgotPasswordOTP from './ForgotPasswordOTP';
import ForgotPasswordChange from './ForgotPasswordChange';

const ForgotPasswordDrawer: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string>("");
    const [showOTPPage, setShowOTPPage] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const [finalToken, setFinalToken] = useState<string>("");
    const [isVerified, setIsVerified] = useState<boolean>(false);

    return (
        <Drawer>
            <DrawerTrigger className='w-full p-1 border border-2 border-blue-500  rounded'>

                Forgot Password

            </DrawerTrigger>
            <DrawerContent className='p-2'>
                <DrawerHeader>
                    <DrawerTitle>Forgot Password</DrawerTitle>
                    <DrawerDescription>
                        {isVerified ? `You can now reset your password.` :
                            showOTPPage ? `We have sent a One Time Password (OTP) to your email: ${userEmail}. Please enter the OTP below to reset your password.` :
                                `Enter your registered email address below and we'll send you a One Time Password (OTP) to reset your password.`}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerDescription>
                    {isVerified && finalToken ? (
                        <ForgotPasswordChange token={finalToken} />
                    ) : showOTPPage ? (
                        <div>
                            <ForgotPasswordOTP token={token} email={userEmail} setFinalToken={setFinalToken} setIsVerified={setIsVerified} />
                        </div>
                    ) : (
                        <div>
                            <ForgotPasswordEmail setToken={setToken} email={userEmail} setShowOTPPage={setShowOTPPage} setEmail={setUserEmail} />
                        </div>
                    )}
                </DrawerDescription>
            </DrawerContent>
        </Drawer>
    );
}

export default ForgotPasswordDrawer;
