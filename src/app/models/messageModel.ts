
import { Prisma } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export async function getMessages({
    page = 1,
    limit = 5,
    sort = "newest"
}: {
    page?: number;
    limit?: number;
    sort?: "newest" | "oldest";
} = {}) {
    const skip = (page - 1) * limit;
    const orderBy: Prisma.GuestBookOrderByWithRelationInput = {
        createdAt: sort === "newest" ? "desc" : "asc"
    };
    const [messages, totalMessages] = await Promise.all([
        prisma.guestBook.findMany({
            skip,
            take: limit,
            orderBy,
        }),
        prisma.guestBook.count()
    ]);
    return { messages, totalMessages };
}

export async function createMessage(name: string, message: string, email: string) {
    return prisma.guestBook.create({
        data: {
            name,
            message,
            email
        },
    });
}
