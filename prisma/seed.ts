import "dotenv/config";

import argon2 from "argon2";
import { PrismaClient, type Role } from "@prisma/client";

const prisma = new PrismaClient();

const admins: Array<{ username: string; password: string; role: Role }> = [
  {
    username: "admin",
    password: "admin",
    role: "ADMIN",
  },
  {
    username: "staff",
    password: "staff",
    role: "STAFF",
  },
] as const;

async function main() {
  await Promise.all(
    admins.map(async ({ username, password, role }) => {
      const hashedPassword = await argon2.hash(password);

      await prisma.admin.upsert({
        where: { username },
        update: {
          password: hashedPassword,
          role,
        },
        create: {
          username,
          password: hashedPassword,
          role,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });


