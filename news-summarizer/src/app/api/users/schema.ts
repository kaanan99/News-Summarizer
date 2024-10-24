import { z } from "zod";

const baseUserSchema = z.object({
    email: z.string().email(),
});

const createUserSchema = z.object({
    email: z.string().email(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
});

export { baseUserSchema, createUserSchema };
