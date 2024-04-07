import z from "zod";

export const defaultEmailSchema = z.object({
    subject: z.string().min(5, "Provide a subject for your email, minimum 5 characters"),
    content: z.string().min(8, "Please provide your message, minimum 8 characters"),
});