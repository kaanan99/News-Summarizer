import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { getSchema, postSchema, updateSchema, deleteSchema } from "./schema";
import { ZodError } from 'zod';

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const parsed_body = getSchema.parse({
            date_added: url.searchParams.get('date_added'),
            tid: url.searchParams.get('tid') || undefined,
            group: url.searchParams.get('group') || undefined,
        });
        const dateAdded = new Date(parsed_body.date_added);

        const rawHeadlines = await prisma.rawHeadline.findMany(
            {
                where: {
                    date_added: dateAdded,
                    tid: parsed_body.tid,
                    group: parsed_body.group,
                }
            }
        );
        return NextResponse.json({
            status: 200,
            message: "OK",
            data: rawHeadlines
        });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error);
            return NextResponse.json("Invalid input data", { status: 400 });
        }
        console.error("Error fetching raw headlines:", error);
        return NextResponse.json("Failed to fetch raw headlines", { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const parsed_body = postSchema.parse(body)
        const dateAdded = new Date(parsed_body.date_added);

        const newRawHeadline = await prisma.rawHeadline.upsert({
            where: {
                headline_text_headline_url: {
                    headline_text: parsed_body.headline_text,
                    headline_url: parsed_body.headline_url,
                },
            },
            update: {
                date_added: dateAdded,
                tid: parsed_body.tid,
                group: parsed_body.group,
            },
            create: {
                headline_text: parsed_body.headline_text,
                headline_url: parsed_body.headline_url,
                date_added: dateAdded,
                tid: parsed_body.tid,
                group: parsed_body.group,
            },
        });
        return NextResponse.json({
            status: 201,
            message: "Raw Headline added successfully",
            data: newRawHeadline,
        });

    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error);
            return NextResponse.json("Invalid input data", { status: 400 });
        }
        console.error("Error adding raw headline:", error);
        return NextResponse.json("Failed to add raw headline", { status: 500 });
    }
    
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json()
        const parsed_body = updateSchema.parse(body)
        const updatedRawHeadline = await prisma.rawHeadline.update(
            {
                where: {
                    rid: parsed_body.rid
                },
                data: {
                    headline_text: parsed_body.headline_text,
                    headline_url: parsed_body.headline_url,
                    date_added: parsed_body.date_added ? new Date(parsed_body.date_added) : undefined,
                    tid: parsed_body.tid,
                    group: parsed_body.group,
                }
            }
        );
        return NextResponse.json({
            status: 200,
            message: "OK",
            data: updatedRawHeadline
        });

    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error);
            return NextResponse.json("Invalid input data", { status: 400 });
        }
        console.error("Error updating raw headline:", error);
        return NextResponse.json("Failed to update raw headline", { status: 500 });
    }
}

export const DELETE =async (req:Request) => {
    try {
        const body = await req.json()
        const parsed_body = deleteSchema.parse(body)

        const deletedRawHeadline = await prisma.rawHeadline.delete(
            {
                where: {
                    rid: parsed_body.rid
                }
            }
        );
        return NextResponse.json({
            status: 200,
            message: "OK",
            data: deletedRawHeadline
        });

    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error);
            return NextResponse.json("Invalid input data", { status: 400 });
        }
        console.error("Error deleting raw headline:", error);
        return NextResponse.json("Failed to delete raw headline", { status: 500 });
    }
}