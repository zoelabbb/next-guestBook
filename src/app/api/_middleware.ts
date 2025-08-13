import { NextResponse } from "next/server";

const RATE_LIMIT = 5; // max 5 requests
const WINDOW_MS = 60 * 1000; // per 1 minute
const ipHits: Record<string, { count: number; start: number }> = {};

export function middleware(req: Request) {
    const url = new URL(req.url);
    if (url.pathname === "/api/messages" && req.method === "POST") {
        const ip = req.headers.get("x-forwarded-for") || "local";
        const now = Date.now();
        if (!ipHits[ip] || now - ipHits[ip].start > WINDOW_MS) {
            ipHits[ip] = { count: 1, start: now };
        } else {
            ipHits[ip].count++;
        }
        if (ipHits[ip].count > RATE_LIMIT) {
            return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
        }
    }
    return NextResponse.next();
}
