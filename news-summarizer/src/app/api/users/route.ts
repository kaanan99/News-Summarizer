import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

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
