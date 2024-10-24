import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { baseUserSchema, createUserSchema } from "./schema";

export const GET = async () => {
    try {
        const users = await prisma.userAccount.findMany();
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

        const newUser = await prisma.userAccount.create({
            data: parsed_body
        });

        return NextResponse.json({
            status: 201,
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Failed to create user", { status: 500 });
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