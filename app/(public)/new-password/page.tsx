"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { newPasswordSchema } from "@/app/validationSchemas/user";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/new-password';

type LoginUserData = z.infer<typeof newPasswordSchema>;

const NewPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const initialValues = {};
    const form = useForm<LoginUserData>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (data: z.infer<typeof newPasswordSchema>) => {
        if (!token) return toast.error('Invalid token');
        data.token = token;
        newPassword(data).then((response) => {
            if (response && 'error' in response) {
                toast.error(response.error as string);
            } else {
                toast.success('Password updated successfully');
                router.push('/login');
            }
        });
    };

    return (
        <Card className="w-[500px] shadow-2xl mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
                        <FormField
                            control={form.control}
                            name="password"
                            defaultValue=""
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="token"
                            defaultValue={token}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="hidden" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-3" type="submit">Reset Password</Button>
                        <Button size="sm" className="px-0" variant="link" type="button">
                            <Link href="/login">
                                Back to login
                            </Link>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default NewPassword
