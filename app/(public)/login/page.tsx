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
import { loginSchema } from "@/app/validationSchemas/user";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import toast from 'react-hot-toast';
import { login } from '@/actions/login';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

type LoginUserData = z.infer<typeof loginSchema>;

const Login = () => {
    const initialValues = {};
    const form = useForm<LoginUserData>({
        resolver: zodResolver(loginSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        login(data).then((response) => {
            if (response && 'error' in response) {
                toast.error(response.error as string);
            } else {
                toast.success('Login successful');
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
                        <Button size="sm" className="px-0" variant="link" type="button">
                            <Link href="/reset-password">
                                Forgot Password?
                            </Link>
                        </Button>
                        <Button className="mt-3" type="submit">Login</Button>
                    </form>
                </Form>
                <Alert className="mt-3 py-2 px-3 shadow-lg bg-slate-50 text-slate-900 font-semibold">
                    <AlertDescription>
                        You do not have an account?
                        <Link className="text-white bg-blue-600 hover:bg-gray-700 rounded-md px-2 py-1 text-sm ms-2" href="/register">Register</Link>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
}

export default Login
