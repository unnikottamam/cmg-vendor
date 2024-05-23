"use client";

import { User } from '@prisma/client';
import React, { useState } from 'react';
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
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from 'react-hot-toast';
import { assignVendorSchema } from '@/app/validationSchemas/vendor';
import { assignVendor } from '@/actions/vendor';
import { FaPlus } from 'react-icons/fa';
import Loading from '@/components/ui/Loading';

const AssignVendor = ({ vendors, products, userId, userName }: { vendors?: User[], products: ProductAssign[], userId?: number, userName?: string }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const productLocation = [
        "Stay in Shop",
        "Go to CMG"
    ];
    const initialValues = {
        vendorId: userId ? userId.toString() : undefined,
        productId: undefined,
        location: ''
    };
    const form = useForm<z.infer<typeof assignVendorSchema>>({
        resolver: zodResolver(assignVendorSchema),
        defaultValues: initialValues,
    });

    const onSubmit = (async (data: z.infer<typeof assignVendorSchema>) => {
        const response = await assignVendor(data);
        if (response && 'error' in response) {
            toast.error(response.error as string);
        } else {
            toast.success('Product assigned successfully to vendor');
            setOpen(false);
            const redirect = userId ? `/vendors/${userId}` : '/vendors';
            router.push(redirect);
            router.refresh();
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FaPlus />
                    Assign Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                        <DialogHeader>
                            <DialogTitle>Assign Product</DialogTitle>
                            <DialogDescription>Assign a product to a vendor</DialogDescription>
                        </DialogHeader>
                        <Card className="shadow-2xl max-w-2xl mt-4">
                            <CardContent className="pt-5 flex flex-col space-y-3">
                                <FormField
                                    control={form.control}
                                    name="vendorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vendor</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        {userId ? <SelectValue /> : <SelectValue placeholder="Select a vendor" />}
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {vendors?.length ? vendors.map((vendor) => (
                                                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                                            {vendor.firstName} {vendor.lastName}
                                                        </SelectItem>
                                                    )) : (
                                                        <SelectItem value={userId!.toString()}>
                                                            {userName}
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="productId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.sku ? `${product.sku} - ` : ''}{product.name} ({product.category})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Does it stay in shop or go to CMG</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Product Location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {productLocation.map((location) => (
                                                        <SelectItem key={location} value={location}>
                                                            {location}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <DialogFooter>
                            <Button className="mt-3" type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
                        </DialogFooter>
                        {form.formState.isSubmitting && (
                            <Loading text="Please wait..." />
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AssignVendor