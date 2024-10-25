import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        console.log(body);
        const { Name: name, Type: type, Link: link } = body.suggestion;
        console.log(name, type, link);

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (
            !name ||
            !type ||
            !link
        ) {
            return new NextResponse("Missing Required Field.", { status: 400 });
        }

        const suggestion = await prismadb.suggestion.create({
            data: {
                userId: user.id,
                name,
                type,
                link
            }
        });

        return NextResponse.json(suggestion);
    } catch (error) {
        console.error("[Saving suggestion]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}