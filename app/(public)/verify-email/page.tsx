"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { verifyEmail } from '@/actions/verify-email';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkToken = async () => {
        verifyEmail(token).then((response) => {
            setIsLoading(false);
            if (response.success) {
                setIsVerified(true);
                toast.success(response.success, { duration: 4000 });
                router.push('/login');
            } else {
                toast.error(response.error!, { duration: 4000 });
                setIsVerified(false);
            }
        });
    }
    useEffect(() => {
        if (token) {
            checkToken();
        }
    }, [token]);

    const renderContent = () => {
        if (isLoading) {
            return 'Verifying email...';
        } else {
            return isVerified ? "Email verified" : "Failed to verify email";
        }
    }

    return (
        <Card className="w-[500px] shadow-2xl mx-auto">
            <CardHeader>
                <CardTitle>Verify Email</CardTitle>
                <CardDescription>{renderContent()}</CardDescription>
            </CardHeader>
        </Card>

    )
}

export default VerifyEmail