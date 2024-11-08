import { z } from "zod";

// Preprocess to convert string values "true" and "1" to true, and "false" and "0" to false
const booleanStringToBoolean = z.preprocess((val) => {
    if (typeof val === "string") {
        if (val.toLowerCase() === "true" || val === "1") return true;
        if (val.toLowerCase() === "false" || val === "0") return false;
    }
    return val; // If it's already a boolean or doesn't match, pass it through
}, z.boolean());

const baseUserSchema = z.object({
    email: z.string().email(),
});

const getUserSchema = z.object({
    is_active: booleanStringToBoolean
})

const createUserSchema = z.object({
    email: z.string().email(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    is_active: booleanStringToBoolean.optional()
});

export { baseUserSchema, createUserSchema, getUserSchema };
