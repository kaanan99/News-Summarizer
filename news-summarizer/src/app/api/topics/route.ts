import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export const GET = async (req: Request) => {
    try {
        const topic = await prisma.topic.findMany();
        return NextResponse.json({
            status: 200,
            message: "OK",
            data: topic
        });

    } catch (error) {
        console.error("Error fetching topic:", error);
        return new NextResponse("Failed to fetch topic", { status: 500 });
    }
};