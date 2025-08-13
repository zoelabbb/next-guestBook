import { getMessages, createMessage } from "../models/messageModel";

export async function fetchMessages({
    page = 1,
    limit = 5,
    sort = 'newest'
}: {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest';
} = {}) {
    return await getMessages({ page, limit, sort });
}

export async function addMessage(name: string, message: string, email: string) {
    if (!name || !message) {
        throw new Error("Name and message cannot be empty");
    }
    if (typeof name !== "string" || typeof message !== "string" || typeof email !== "string") {
        throw new Error("Name, message, and email must be strings");
    }
    if (message.length > 100) {
        throw new Error("Message must be at most 100 characters long");
    }
    if (email && !/^([\w-.]+)@([\w-]+)\.([\w]{2,})$/.test(email)) {
        throw new Error("Email format is invalid");
    }
    return await createMessage(name, message, email);
}