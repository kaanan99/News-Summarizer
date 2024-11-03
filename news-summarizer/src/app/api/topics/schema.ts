import { z } from "zod";

const baseTopicSchema = z.object({
    topic_type: z.string().min(1, "Topic type is required").optional()
});

const createTopicSchema = z.object({
    topic_type: z.string().min(1, "Topic type is required"),
    topic_key: z.string().min(1, "Topic key is required")
});

export { baseTopicSchema, createTopicSchema };
