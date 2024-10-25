import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { email } = body;

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!email) return new NextResponse("Missing email.", { status: 400 });

        const newUser = await prismadb.user.create({
            data: {
                userEmail: email,
                role: "staff"
            }
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error("[USER CREATION]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
