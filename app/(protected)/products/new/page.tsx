"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { productSchema } from '@/app/validationSchemas/product';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BiLoaderAlt } from "react-icons/bi";
import TipTap from '@/app/components/TextEditor/TipTap';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loading from "@/components/ui/Loading";
import imageCompression from 'browser-image-compression';

const compressImage = async (image: File) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
    };
    try {
        const compressedBlob = await imageCompression(image, options);
        const compressedFile = new File([compressedBlob], image.name, {
            type: compressedBlob.type,
            lastModified: image.lastModified
        });
        return compressedFile;
    } catch (error) {
        return image;
    }
};

const fetchAllCategories = async () => {
    try {
        const response = await axios.get<Category[]>('/api/products');
        return response.data;
    } catch (error) {
        throw new Error("Error fetching categories");
    }
};

const productLocation = [
    "Stay in Shop",
    "Go to CMG"
];

const NewProduct = () => {
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const router = useRouter();
    const initialValues = {
        title: "",
        category: "",
        location: "",
        content: "",
        files: []
    };

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: initialValues,
    });

    const [files, setFiles] = useState<File[]>([]);
    const onDrop = async (acceptedFiles: File[]) => {
        const compressedFilesPromises = acceptedFiles.map((file) => compressImage(file));
        const compressedFiles = await Promise.all(compressedFilesPromises);
        setFiles(compressedFiles);
        form.setValue('files', compressedFiles, { shouldValidate: true });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 5,
    });

    const onSubmit = async (data: z.infer<typeof productSchema>) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('category', data.category);
            formData.append('location', data.location);
            data.files.forEach((file) => {
                formData.append('files[]', file);
            });

            await axios.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Product created successfully");
            router.push('/products');
            router.refresh();
        } catch (error) {
            toast.error("There was an error creating the product, please contact sales team");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await fetchAllCategories();
                const parentCategories = categories.filter((category) => category.parent === 0);
                const firstChildCategories = categories.filter((category) => {
                    return parentCategories.some((parent) => parent.id === category.parent);
                });
                const secondChildCategories = categories.filter((category) => {
                    return firstChildCategories.some((child) => child.id === category.parent);
                });
                parentCategories.forEach((parent) => {
                    parent.children = firstChildCategories.filter((child) => child.parent === parent.id);
                    parent.children.forEach((child) => {
                        child.children = secondChildCategories.filter((secondChild) => secondChild.parent === child.id);
                    });
                });
                setAllCategories(parentCategories);
            } catch (error) {
                toast.error(error as string);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col space-y-3">
            {!allCategories.length ?
                <div className="flex flex-col justify-center items-center text-center">
                    <Loading text="Please wait..." />
                </div>
                : <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full shadow-lg p-6 border border-slate-200 relative">
                            <div className="flex flex-col space-y-3">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Title *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ex: Biesse Selco EB70 Beam Saw" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select a Category *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allCategories.map((category) => {
                                                        return category.children?.length ? (
                                                            <SelectGroup key={category.id}>
                                                                <SelectLabel className="text-lg">{category.name.replace(/&amp;/g, '&')}</SelectLabel>
                                                                {category.children.map((child) => {
                                                                    return child.children?.length ? (
                                                                        <SelectGroup key={child.id}>
                                                                            <SelectLabel className="font-normal">{child.name.replace(/&amp;/g, '&')}</SelectLabel>
                                                                            {child.children.map((secondChild) => (
                                                                                <SelectItem className="ml-6 text-sm" key={secondChild.id} value={secondChild.id.toString()}>
                                                                                    {secondChild.name.replace(/&amp;/g, '&')}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectGroup>
                                                                    ) : (
                                                                        <SelectItem key={child.id} value={child.id.toString()}>
                                                                            {child.name.replace(/&amp;/g, '&')}
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                            </SelectGroup>
                                                        ) : "";
                                                    })}
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Location" />
                                                </SelectTrigger>
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
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Description *</FormLabel>
                                            <TipTap content={field.value} onChange={field.onChange} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <h2 className="text-md font-semibold text-destructive -mb-3">Uploading Image Instructions (Important)</h2>
                                <p className="text-sm">Pictures should be <span className="text-destructive font-semibold">clear, bright, and clean, with no obstructions or tools in view</span>. Provide multiple photos from all angles.</p>
                                <div className="flex gap-1 flex-wrap">
                                    <Image className="w-[24%]" priority={true} quality={85} src="/blur.jpg" alt="CMG" width={138} height={138} />
                                    <Image className="w-[24%]" priority={true} quality={85} src="/info.jpg" alt="CMG" width={138} height={138} />
                                    <Image className="w-[24%]" priority={true} quality={85} src="/clean.jpg" alt="CMG" width={138} height={138} />
                                    <Image className="w-[24%]" priority={true} quality={85} src="/part.jpg" alt="CMG" width={138} height={138} />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="files"
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Product Images *
                                                <p className="text-xs">(jpg, png formats only, size must be &lt; 5mb)</p>
                                            </FormLabel>
                                            <div {...getRootProps()} className="border py-1 px-3 rounded-md border-slate-200 cursor-pointer">
                                                <input {...getInputProps()} />
                                                <p className="text-sm text-center text-destructive flex flex-col items-center justify-center">
                                                    <em>
                                                        Drag and drop <strong>multiple</strong> images here, or click to select <strong>multiple files</strong>
                                                    </em>
                                                    <strong>Select Max 5 Images</strong>
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {files.map((file, index) => (
                                                    <Image
                                                        key={index}
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-full p-1 border"
                                                        quality={85}
                                                        width={100}
                                                        height={100}
                                                        style={{ height: '100px' }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button variant="success" type="submit" disabled={form.formState.isSubmitting}>
                                Create Product
                            </Button>
                            {form.formState.isSubmitting && (
                                <Loading text="Please wait..." />
                            )}
                        </form>
                    </Form>
                </>
            }
        </div>
    )
}

export default NewProduct