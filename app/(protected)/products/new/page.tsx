"use client";
import ErrorMesssage from '@/app/components/ErrorMesssage';
import { Controller, useForm } from "react-hook-form";
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

type CreateProductData = z.infer<typeof productSchema>;
interface Category {
    id: number;
    name: string;
}

const fetchAllCategories = async () => {
    try {
        const response = await axios.get<Category[]>(`/api/products`);
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
    const initialValues = {};
    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<CreateProductData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialValues,
    });

    const [files, setFiles] = useState<File[]>([]);
    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        setValue('files', acceptedFiles, { shouldValidate: true });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('category', data.category);
            formData.append('location', data.location);
            data.files.forEach((file, index) => {
                formData.append(`files[]`, file);
            });

            await axios.post(`/api/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Product created successfully");
            router.push(`/products`);
            router.refresh();
        } catch (error) {
            toast.error("There was an error creating the product, please contact sales team");
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await fetchAllCategories();
                setAllCategories(categories);
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
                    <BiLoaderAlt className="animate-spin" />
                    <p>Loading ...</p>
                </div>
                : <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full shadow-lg p-6 border border-slate-200" onSubmit={onSubmit}>
                    <div className="flex flex-col space-y-3">
                        <label className="block text-md font-medium leading-6">
                            Product Title *
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-2.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300"
                                    placeholder="Biesse Selco EB70 Beam Saw"
                                    {...register("title")}
                                />
                            </div>
                        </label>
                        {<ErrorMesssage>{errors.title?.message}</ErrorMesssage>}
                        <label className="block text-md font-medium leading-6">
                            Select a Category *
                            <select
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300"
                                {...register("category")}>
                                <option value="">Select</option>
                                {allCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                        dangerouslySetInnerHTML={{ __html: category.name }}
                                    />
                                ))}
                            </select>
                        </label>
                        {<ErrorMesssage>{errors.category?.message}</ErrorMesssage>}
                        <label className="block text-md font-medium leading-6">
                            Does it stay in shop or go to CMG
                            <select
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300"
                                {...register("location")}>
                                <option value="">Select</option>
                                {productLocation.map((location) => (
                                    <option
                                        key={location}
                                        value={location}
                                        dangerouslySetInnerHTML={{ __html: location }}
                                    />
                                ))}
                            </select>
                        </label>
                        {<ErrorMesssage>{errors.location?.message}</ErrorMesssage>}
                        <label className="block text-md font-medium leading-6">
                            Product Description *
                        </label>
                        <Controller
                            control={control}
                            name="content"
                            defaultValue=""
                            render={({ field }) => (
                                <TipTap content={field.value} onChange={field.onChange} />
                            )}
                        />
                        {<ErrorMesssage>{errors.content?.message}</ErrorMesssage>}
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
                        <label className="block text-md font-medium leading-6 d-flex flex-wrap gap-2">
                            Product Images *
                            <p className="text-xs">(jpg, png formats only, size must be &lt; 5mb)</p>
                        </label>
                        <Controller
                            control={control}
                            name="files"
                            defaultValue={[]}
                            render={() => (
                                <>
                                    <div {...getRootProps()} className="border py-2 px-3 rounded-md border-gray-300">
                                        <input {...getInputProps()} />
                                        <p className="text-sm text-center text-destructive">
                                            <em>
                                                Drag 'n' drop <strong>multiple</strong> images here, or click to select <strong>multiple files</strong>
                                            </em>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {files.map((file, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full p-1 border"
                                                style={{ height: '100px' }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        />
                        {<ErrorMesssage>{errors.files?.message}</ErrorMesssage>}
                    </div>
                    <button disabled={isSubmitting} className="flex gap-2 items-center justify-center text-white bg-green-600 hover:bg-gray-700 rounded-md px-3 py-2 text-md font-medium">
                        Create Product
                        {(isSubmitting || isSubmitSuccessful) && <BiLoaderAlt className="animate-spin" />}
                    </button>
                </form>
            }
        </div>
    )
}

export default NewProduct