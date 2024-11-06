import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { baseTopicSchema, createTopicSchema } from "./schema";


export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = Object.fromEntries(url.searchParams);

        const parsedBody = baseTopicSchema.parse(params);
        let topic;
        if (Object.keys(parsedBody).length > 0) {
            topic = await prisma.topic.findFirst({
                where: { topic_type: parsedBody.topic_type }
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
        return new NextResponse("Failed to fetch topic", { status: 500 });
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
        console.error("Error creating topic:", error);
        return new NextResponse("Failed to create topic", { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = Object.fromEntries(url.searchParams);
        const parsedBody = baseTopicSchema.parse(params);

        const deleted_topic = await prisma.topic.delete({
            where: { topic_type: parsedBody.topic_type }
        });

        return NextResponse.json({
            status: 200,
            message: "Topic deleted successfully",
            data: deleted_topic,
        });
    } catch (error) {
        console.error("Error deleting topic:", error);
        return new NextResponse("Failed to delete topic", { status: 500 });
    }
};