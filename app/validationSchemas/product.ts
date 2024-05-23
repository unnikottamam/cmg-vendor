import z from "zod";

export const imageSchema = z.object({
    file: z.object({
        name: z.string(),
        size: z.number(),
        type: z.string().regex(/^image\//),
    }),
    previewURL: z.string(),
});

export const productSchema = z.object({
    title: z.string().min(3, "Title is required"),
    category: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Location is required"),
    content: z.string().min(20, "Product Description is required (min 20 characters)"),
    files: z.custom<Blob>().array().max(5, "You can only upload up to 5 images").min(1, "At least one image is required")
});