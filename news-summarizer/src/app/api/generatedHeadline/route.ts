import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { getSchema, postSchema, updateSchema, deleteSchema } from "./schema";
import { ZodError } from 'zod';

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const parsed_body = getSchema.parse({
            date_added: url.searchParams.get('date_added'),
            tid: url.searchParams.get('tid'),
            group: url.searchParams.get('group'),
        });
        const dateAdded = new Date(parsed_body.date_added);
        const genHeadlines = await prisma.geneartedHeadline.findMany(
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
            data: genHeadlines
        });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error);
            return NextResponse.json("Invalid input data", { status: 400 });
        }
        console.error("Error fetching generated headlines:", error);
        return NextResponse.json("Failed to fetch generated headlines", { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const parsed_body = postSchema.parse(body)
        const dateAdded = new Date(parsed_body.date_added);

        const newGenHeadline = await prisma.geneartedHeadline.upsert(
            {
                where: {
                    headline_text_date_added :{
                        headline_text: parsed_body.headline_text,
                        date_added: dateAdded,
                    }
                },
                update:{
                    tid: parsed_body.tid,
                    group: parsed_body.group,
                },
                create: {
                    headline_text: parsed_body.headline_text,
                    date_added: dateAdded,
                    tid: parsed_body.tid,
                    group: parsed_body.group,
                }
            }
        );
        return NextResponse.json({
            status: 201,
            message: "Generated Headline added successfully",
            data: newGenHeadline,
        });

    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error);
            return NextResponse.json("Invalid input data", { status: 400 });
        }
        console.error("Error adding generated headline:", error);
        return NextResponse.json("Failed to add generated headline", { status: 500 });
    }
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json()
        const parsed_body = updateSchema.parse(body)
        const updatedRawHeadline = await prisma.geneartedHeadline.update(
            {
                where: {
                    gid: parsed_body.gid
                },
                data: {
                    headline_text: parsed_body.headline_text,
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
        console.error("Error updating generated headline:", error);
        return NextResponse.json("Failed to update generated headline", { status: 500 });
    }
}

export const DELETE =async (req:Request) => {
    try {
        const body = await req.json()
        const parsed_body = deleteSchema.parse(body)

        const deletedRawHeadline = await prisma.geneartedHeadline.delete(
            {
                where: {
                    gid: parsed_body.gid
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
        console.error("Error deleting generated headline:", error);
        return NextResponse.json("Failed to delete generated headline", { status: 500 });
    }
}