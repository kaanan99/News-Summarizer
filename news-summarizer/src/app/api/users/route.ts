import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { baseUserSchema, createUserSchema, getSchema } from "./schema";

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = Object.fromEntries(url.searchParams);
        
        const parsedParams = getSchema.parse({
            is_active: params.is_active === undefined ? undefined : params.is_active === 'true'
        });

        const users = await prisma.userAccount.findMany({
            where: parsedParams.is_active !== undefined ? { is_active: parsedParams.is_active } : {}
        });

        return NextResponse.json({
            status: 200,
            message: "OK",
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse("Failed to fetch users", { status: 500 });
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
        console.error("Error creating or updating user:", error);
        return new NextResponse("Failed to create or update user", { status: 500 });
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
        console.error("Error deleted user:", error);
        return new NextResponse("Failed to delete user", { status: 500 });
    }
};