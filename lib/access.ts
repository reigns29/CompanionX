import { auth, currentUser } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const checkAccess = async () => {
    const { userId } = auth();
    const user = await currentUser();

    const email = user?.emailAddresses[0].emailAddress;

    if (!userId || !user || !email) return false;

    const getUser = await prismadb.user.findUnique({
        where: {
            userEmail: email
        },
        select: {
            userEmail: true,
            role: true
        }
    })

    if (!getUser) return false;

    return getUser;
}