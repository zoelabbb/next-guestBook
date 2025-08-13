// Ini untuk seed guest data.
import { PrismaClient } from "../../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
    await prisma.guestBook.createMany({
        data: [
            {
                name: "John Doe",
                email: "john.doe@example.com",
                message: "Hello, this is a test message!",
            },
            {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                message: "Hi, I'm interested in your services.",
            },
        ],
    });
}

main()
    .then(() => {
        console.log("Guest data seeded successfully.");
    })
    .catch((error) => {
        console.error("Error seeding guest data:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });