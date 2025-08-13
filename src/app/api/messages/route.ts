import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 5);
        const skip = (page - 1) * limit;
        const [messages, totalMessages] = await Promise.all([
            prisma.guestBook.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.guestBook.count()
        ]);
        return NextResponse.json({ messages, totalMessages });
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil pesan." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, message, email } = await req.json();
        if (!name || !message || !email) {
            return NextResponse.json({ error: "Nama, pesan, dan email wajib diisi." }, { status: 400 });
        }
        if (typeof name !== "string" || typeof message !== "string" || typeof email !== "string") {
            return NextResponse.json({ error: "Format data salah." }, { status: 400 });
        }
        if (message.length > 100) {
            return NextResponse.json({ error: "Pesan maksimal 100 karakter." }, { status: 400 });
        }
        const newMsg = await prisma.guestBook.create({
            data: { name, message, email: email || "" },
        });
        return NextResponse.json(newMsg);
    } catch (error) {
        return NextResponse.json({ error: "Gagal menyimpan pesan." }, { status: 500 });
    }
}
