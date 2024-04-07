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
import { resetSchema } from "@/app/validationSchemas/user";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { reset } from '@/actions/reset';
import { useRouter } from 'next/navigation';

type LoginUserData = z.infer<typeof resetSchema>;

const ResetPassword = () => {
    const router = useRouter();
    const initialValues = {};
    const form = useForm<LoginUserData>({
        resolver: zodResolver(resetSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (data: z.infer<typeof resetSchema>) => {
        reset(data).then((response) => {
            if (response && 'error' in response) {
                toast.error(response.error as string);
            } else {
                toast.success('Please check your email to reset your password');
                router.push('/login');

            }
        });
    };

    return (
        <Card className="w-[500px] shadow-2xl mx-auto">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
                        <FormField
                            control={form.control}
                            name="email"
                            defaultValue=""
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-3" type="submit">Send Reset Email</Button>
                        <Button size="sm" className="px-0" variant="link" type="button">
                            <Link href="/login">
                                Back to Login
                            </Link>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ResetPassword