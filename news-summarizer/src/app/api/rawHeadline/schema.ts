import { z } from "zod";

const getSchema = z.object({
    date_added: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Use YYYY-MM-DD.",
    }),
    tid: z.coerce.number().int().positive(),
    group: z.coerce.number().int().positive()
});

const postSchema = z.object({
    headline_text: z.string(),
    headline_url: z.string().url(),
    date_added: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Use YYYY-MM-DD.",
    }),
    tid: z.number().positive().int(),
    group: z.number().positive().int(),
});

const updateSchema = z.object({
    rid: z.number().int(),
    headline_text: z.string().optional(),
    headline_url: z.string().url().optional(),
    date_added: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Use YYYY-MM-DD.",
    }).optional(),
    tid: z.number().positive().int().optional(),
    group: z.number().positive().int().optional(),
});

const deleteSchema = z.object({
    rid: z.number().int()
});

export { getSchema, postSchema, updateSchema, deleteSchema };
