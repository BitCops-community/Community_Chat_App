import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { displaySooner } from './showSonner';
import { useRouter } from 'next/navigation';

interface functionProps {
    token: string;
}

export default function ForgotPasswordChange({ token }: functionProps) {
    const [password, setPassword] = useState<string>('');
    const [cpassword, setCpassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleChangePassword = async () => {
        if (password.length < 8 || cpassword.length < 8) {
            displaySooner('Password must be at least 8 characters long.');
            return;
        }
        if (password !== cpassword) {
            displaySooner('Passwords do not match.');
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('/api/v1/auth/reset/change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password, cpassword }),
            });

            const data = await response.json();
            if (data.success) {
                displaySooner(data.message)
                setPassword('');
                setCpassword('');
                router.push('/auth/signin');
            } else {
                displaySooner(data.message)
            }
        } catch (error) {
            displaySooner(`Error While Changing Password`)
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full md:w-[300px] mx-auto'>
            <div className="my-3">
                <Label>Please Enter New Password</Label>
                <Input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="my-3">
                <Label>Please Enter New Password Again</Label>
                <Input
                    type='password'
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                />
            </div>
            <Button
                className='w-full'
                variant={"outline"}
                onClick={handleChangePassword}
                disabled={loading}
            >
                {loading ? 'Changing...' : 'Change Password'}
            </Button>
        </div>
    );
}
