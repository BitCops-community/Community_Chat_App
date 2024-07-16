import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from './ui/input';
import { displaySooner } from './showSonner';
interface ForgotPasswordEmailProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setShowOTPPage: React.Dispatch<React.SetStateAction<boolean>>;
    setToken: (val: string) => void;
}

const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({ email, setEmail, setShowOTPPage, setToken }) => {

    const [loading, setLoading] = useState<boolean>(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleEmailSubmit = async () => {
        if (emailRegex.test(email)) {
            try {
                setLoading(true)
                const req = await fetch("/api/v1/auth/reset/sendOtp", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const res = await req.json();
                console.log(res);

                if (res.success) {
                    displaySooner(res.message)
                    setToken(res.token);
                    setShowOTPPage(true);
                } else {
                    displaySooner(res.message)
                }
            } catch (error) {
                console.log(`Error While Sending Request!`);
                displaySooner(`Error While Sending Request!`)
            } finally {
                setLoading(false)
            }
        } else {
            displaySooner('Please enter a valid email address.')
            return;
        }
    };


    return (
        <div className='w-full md:w-[300px] mx-auto'>
            <h2>Enter your email address</h2>
            <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button className='w-full my-3' disabled={loading} onClick={handleEmailSubmit}>{loading ? "Please Wait..." : "Submit"}</Button>
        </div>
    );
};

export default ForgotPasswordEmail;
