import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from 'zod';
import prisma from "../../../../prisma/prisma";
import { baseUserSchema, createUserSchema, getUserSchema } from "./schema";

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = Object.fromEntries(url.searchParams);
        
        let parsedParams;
        // Only parse if is_active is present in params
        if (params.is_active) {
            parsedParams = getUserSchema.parse(params);
        } else {
            parsedParams = {};
        }

        let users;
        if (Object.keys(parsedParams).length > 0) {
            users = await prisma.userAccount.findMany(
                {
                    where: { is_active: parsedParams.is_active }
                }
            );
        } else {
            users = await prisma.userAccount.findMany();
        }

        return NextResponse.json({
            status: 200,
            message: "OK",
            data: users
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

        Sentry.captureException(error);
        return NextResponse.json({
            status: 500,
            message: "Error fetching users",
            errors: error,
        },
        { status: 500 });
    }
};


export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const parsed_body = createUserSchema.parse(body);

        const newUser = await prisma.userAccount.upsert(
            {
                where: { email: parsed_body.email },
                create: parsed_body,
                update: {
                    first_name: parsed_body.first_name,
                    last_name: parsed_body.last_name,
                    is_active: parsed_body.is_active ?? true
                }
            }
        );

        return NextResponse.json({
            status: 201,
            message: "User created or updated successfully",
            data: newUser,
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

        Sentry.captureException(error);
        return NextResponse.json({
            status: 500,
            message: "Error creating or updating user",
            errors: error,
        },
        { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const body = await req.json();
        const email = baseUserSchema.parse(body);

        const newUser = await prisma.userAccount.delete({
            where: email
        });

        return NextResponse.json({
            status: 200,
            message: "User deleted successfully",
            data: newUser,
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

        Sentry.captureException(error);
        return NextResponse.json({
                status: 500,
                message: "Error deleting user",
                errors: error,
        },
        { status: 500 });
    }
};