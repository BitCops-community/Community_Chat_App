import React, { useState } from 'react';
import { Button } from './ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { displaySooner } from './showSonner';
interface ForgotPasswordOTPProps {
    email: string;
    token: string;
    setFinalToken: (val: string) => void;
    setIsVerified: (val: boolean) => void;
}

const ForgotPasswordOTP: React.FC<ForgotPasswordOTPProps> = ({ email, token, setFinalToken, setIsVerified }) => {
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleOTPSubmit = async () => {
        if (otp && otp.length === 6 && token) {
            try {
                setLoading(true);
                const req = await fetch("/api/v1/auth/reset/verify", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ otp }),
                });

                const res = await req.json();
                if (res.success) {
                    displaySooner(res.message)
                    setFinalToken(res?.token);
                    setIsVerified(true)
                } else {
                    displaySooner(res.message)
                    return;
                }

            } catch (error) {
                displaySooner(`Error Occurred During Verification`)
                return
            } finally {
                setLoading(false)
            }
        } else {
            displaySooner('Please enter a valid 6-digit OTP')
            return;
        }
    };

    return (
        <div className='w-full mx-auto md:w-[300px]'>
            <h2 className='text-center'>Enter OTP sent to {email}</h2>
            <div className="w-full mx-auto flex items-center justify-center">
                <InputOTP value={otp} onChange={(value) => setOtp(value)} className='mx-auto w-full' maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                    <InputOTPGroup className='w-full relative text-center mx-auto' >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <Button onClick={handleOTPSubmit} disabled={loading} className='w-full my-3' variant={"outline"}>{loading ? "Please Wait..." : "Verify"}</Button>
        </div>
    );
};

export default ForgotPasswordOTP;
