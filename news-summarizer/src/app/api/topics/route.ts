import { NextResponse } from "next/server";
import { z } from 'zod';
import prisma from "../../../../prisma/prisma";
import { baseTopicSchema, createTopicSchema } from "./schema";

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = Object.fromEntries(url.searchParams);

        let parsedParams;
        // Only parse if topic_type is present in params
        if (params.topic_type) {
            parsedParams = baseTopicSchema.parse(params);
        } else {
            parsedParams = {};
        }

        let topic;
        // Filter by optional topic_type param if provided
        if (Object.keys(parsedParams).length > 0) {
            topic = await prisma.topic.findFirst({
                where: { topic_type: parsedParams.topic_type }
            });
        } else {
            topic = await prisma.topic.findMany();
        }

        if (topic != null) {
            return NextResponse.json({
                status: 200,
                message: "OK",
                data: topic
            });    
        } else {
            return NextResponse.json({
                status: 404,
                message: "Could not find topic"
                },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Error fetching topic:", error);
        return NextResponse.json({
            status: 500,
            message: "Error fetching topic",
            errors: error,
        },
        { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const parsed_body = createTopicSchema.parse(body);

        const newTopic = await prisma.topic.create({
            data: parsed_body
        });

        return NextResponse.json({
            status: 201,
            message: "Topic created successfully",
            data: newTopic,
        },
        { status: 201});
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            const errorMessages = error.errors.map(err => ({
                field: err.path[0],
                message: err.message,
            }));

            return NextResponse.json({
                status: 400,
                message: "Validation failed",
                errors: errorMessages,
            },
            { status: 400 });
        }

        console.error("Error creating topic:", error);
        return NextResponse.json({
            status: 500,
            message: "Error creating topic",
            errors: error,
        },
        { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const body = await req.json();
        const parsed_body = baseTopicSchema.parse(body);

        const deleted_topic = await prisma.topic.delete({
            where: { topic_type: parsed_body.topic_type }
        });

        return NextResponse.json({
            status: 200,
            message: "Topic deleted successfully",
            data: deleted_topic,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            const errorMessages = error.errors.map(err => ({
                field: err.path[0],
                message: err.message,
            }));

            return NextResponse.json({
                status: 400,
                message: "Validation failed",
                errors: errorMessages,
            },
            { status: 400 });
        }

        console.error("Error deleting topic:", error);
        return NextResponse.json({
                status: 500,
                message: "Error deleting topic",
                errors: error,
        },
        { status: 500 });
    }
};