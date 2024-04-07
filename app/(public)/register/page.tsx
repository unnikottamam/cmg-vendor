"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
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
import { userSchema } from '../../validationSchemas/user';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from 'react-hot-toast';
import Script from 'next/script';
import { register } from '@/actions/register';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type CreateUserData = z.infer<typeof userSchema>;
declare global {
    interface Window {
        grecaptcha: any;
    }
}

const Register = () => {
    const router = useRouter();

    const initialValues = {};
    const form = useForm<CreateUserData>({
        resolver: zodResolver(userSchema),
        defaultValues: initialValues,
    });

    const onSubmit = (async (data: z.infer<typeof userSchema>) => {
        const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' });
        data.recaptchaToken = token;

        register(data).then(response => {
            if (response.error) {
                toast.error(response.error.toString());
            } else if (response.success) {
                toast.success(response.success);
                router.push('/login');
                router.refresh();
            }
        })
    });

    return (
        <>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            />
            <Card className="w-[500px] shadow-2xl mx-auto">
                <CardHeader className="pb-3">
                    <CardTitle>Register Now!</CardTitle>
                    <CardDescription>Ready to showcase your machines to the world? Take the first step towards selling them by registering with us.</CardDescription>
                    <Alert className="py-2 px-3 shadow-lg bg-slate-50 text-slate-900 font-semibold">
                        <AlertDescription>
                            Already have an account?
                            <Link className="text-white bg-blue-600 hover:bg-gray-700 rounded-md px-2 py-1 text-sm ms-2" href="/login">Login</Link>
                        </AlertDescription>
                    </Alert>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
                            <FormField
                                control={form.control}
                                name="firstName"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                name="phone"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="streetAddress"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                defaultValue="CANADA"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CANADA">Canada</SelectItem>
                                                <SelectItem value="USA">USA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zip"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zip</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recaptchaToken"
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="hidden" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="mt-3" type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

export default Register
