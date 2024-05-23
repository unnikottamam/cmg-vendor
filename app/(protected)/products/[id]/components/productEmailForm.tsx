"use client";
import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form'
import { defaultEmailSchema } from '@/app/validationSchemas/email'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { sendEmailToSales } from '@/lib/emails';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/components/ui/Loading';

type EmailData = z.infer<typeof defaultEmailSchema>;

const ProductEmailForm = ({ product }: { product: ProductInfo }) => {
    const router = useRouter();
    const initialValues = {};
    const form = useForm<EmailData>({
        resolver: zodResolver(defaultEmailSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (data: z.infer<typeof defaultEmailSchema>) => {
        await sendEmailToSales(product, data);
        toast.success('Email sent successfully');
        router.push('/products');
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 relative">
                <FormField
                    control={form.control}
                    name="subject"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Please provide your message"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Send Mail</Button>
                </DialogFooter>
                {form.formState.isSubmitting && (
                    <Loading text="Please wait..." />
                )}
            </form>
        </Form>
    )
}

export default ProductEmailForm