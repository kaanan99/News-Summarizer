import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { ZodError } from 'zod';
import prisma from "../../../../prisma/prisma";
import { deleteSchema, getSchema, postSchema, updateSchema } from "./schema";

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const parsed_body = getSchema.parse({
            date_added: url.searchParams.get('date_added'),
            tid: url.searchParams.get('tid') || undefined,
            group: url.searchParams.get('group') || undefined,
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
        Sentry.captureException(error);
        return NextResponse.json({
            status: 500,
            message: "Failed to fetch generated headlines",
            errors: error,
        },
        { status: 500 });
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
        Sentry.captureException(error);
        return NextResponse.json({
            status: 500,
            message: "Failed to add generated headline",
            errors: error,
        },
        { status: 500 });
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
        Sentry.captureException(error);
        return NextResponse.json({
            status: 500,
            message: "Failed to update generated headline",
            errors: error,
        },
        { status: 500 });
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
        Sentry.captureException(error);
        return NextResponse.json({
            status: 500,
            message: "Failed to delete generated headline",
            errors: error,
        },
        { status: 500 });
    }
}